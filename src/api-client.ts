import type { IvaConfig, ApiType, ApiRequestOptions, HttpMethod } from "./types.js";
import { IvaApiError } from "./error.js";

const DEFAULT_TIMEOUT_MS = 30000;

// User-Agent identifies this MCP server in IVA API access logs.
// Callers can override it per-request via opts.headers["User-Agent"].
const USER_AGENT = "mcp-iva360";

const API_PATHS: Record<ApiType, string> = {
  clients: "/api/rest",
};

export class IvaApiClient {
  private cachedSessionToken?: string;
  // Shared in-flight login promise. The server may invalidate the previous
  // session on each new login, so concurrent first requests must not trigger
  // multiple logins racing to overwrite each other's session.
  private loginPromise?: Promise<string>;

  constructor(private config: IvaConfig) {
    this.cachedSessionToken = config.sessionToken;
  }

  private async getFreshSessionToken(force = false): Promise<string> {
    if (!force && this.cachedSessionToken) return this.cachedSessionToken;

    if (!this.config.login || !this.config.password) {
      throw new IvaApiError(
        401,
        "No authentication configured for Clients API. Set IVA_SESSION_TOKEN, IVA_JWT_TOKEN, or IVA_LOGIN + IVA_PASSWORD.",
        "AUTH_NOT_CONFIGURED",
      );
    }

    if (!this.loginPromise) {
      this.loginPromise = this.login().finally(() => {
        this.loginPromise = undefined;
      });
    }
    return this.loginPromise;
  }

  private async login(): Promise<string> {
    const url = `${this.config.baseUrl}/api/rest/login`;

    let response: Response;
    try {
      response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: this.config.login, password: this.config.password }),
        signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
      });
    } catch (err) {
      if (err instanceof Error && (err.name === "AbortError" || err.name === "TimeoutError")) {
        throw new IvaApiError(
          408,
          `Auto-login timed out after ${DEFAULT_TIMEOUT_MS}ms`,
          "REQUEST_TIMEOUT",
        );
      }
      throw err;
    }

    if (!response.ok) {
      throw new IvaApiError(
        response.status,
        `Auto-login failed: HTTP ${response.status}`,
        "AUTH_LOGIN_FAILED",
      );
    }

    const responseText = await response.text();
    let data: { sessionId?: string };
    try {
      data = JSON.parse(responseText) as { sessionId?: string };
    } catch {
      throw new IvaApiError(
        response.status,
        "Auto-login failed: server returned a non-JSON response",
        "AUTH_LOGIN_FAILED",
      );
    }

    if (!data.sessionId) {
      throw new IvaApiError(
        401,
        "Auto-login failed: server did not return sessionId",
        "AUTH_LOGIN_FAILED",
      );
    }

    this.cachedSessionToken = data.sessionId;
    return this.cachedSessionToken;
  }

  private async buildAuthHeaders(apiType: ApiType): Promise<Record<string, string>> {
    const headers: Record<string, string> = {};
    switch (apiType) {
      case "clients": {
        if (this.config.sessionToken) {
          headers["Session"] = this.config.sessionToken;
        } else if (this.config.jwtToken) {
          headers["Authorization"] = `Bearer ${this.config.jwtToken}`;
        } else if (this.config.login && this.config.password) {
          const session = await this.getFreshSessionToken();
          headers["Session"] = session;
        } else {
          throw new IvaApiError(
            401,
            "No authentication configured for Clients API. Set IVA_SESSION_TOKEN, IVA_JWT_TOKEN, or IVA_LOGIN + IVA_PASSWORD.",
            "AUTH_NOT_CONFIGURED",
          );
        }
        break;
      }
    }
    return headers;
  }

  private buildPath(path: string, pathParams?: Record<string, string | number>): string {
    if (!pathParams) return path;
    let result = path;
    for (const [key, value] of Object.entries(pathParams)) {
      result = result.replaceAll(`{${key}}`, encodeURIComponent(String(value)));
    }
    return result;
  }

  private buildQuery(params?: Record<string, unknown>): string {
    if (!params) return "";
    const parts: string[] = [];
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) continue;
      if (Array.isArray(value)) {
        for (const item of value) {
          parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`);
        }
      } else if (typeof value === "boolean") {
        parts.push(`${encodeURIComponent(key)}=${value}`);
      } else if (value instanceof Date) {
        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value.toISOString())}`);
      } else {
        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
      }
    }
    return parts.length > 0 ? `?${parts.join("&")}` : "";
  }

  // True when the active Clients API auth path is login/password (not a static
  // session or JWT token), so an expired session can be recovered by re-login.
  private canReauth(): boolean {
    return (
      !this.config.sessionToken &&
      !this.config.jwtToken &&
      !!this.config.login &&
      !!this.config.password
    );
  }

  async request<T = unknown>(opts: ApiRequestOptions): Promise<T> {
    return this.doRequest<T>(opts, false);
  }

  private async doRequest<T = unknown>(opts: ApiRequestOptions, isRetry: boolean): Promise<T> {
    const basePath = API_PATHS[opts.apiType];
    const fullPath = this.buildPath(opts.path, opts.pathParams);
    const queryString = this.buildQuery(opts.queryParams);
    const url = `${this.config.baseUrl}${basePath}${fullPath}${queryString}`;

    const authHeaders = await this.buildAuthHeaders(opts.apiType);
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "User-Agent": USER_AGENT,
      ...authHeaders,
      ...(opts.headers || {}),
    };

    let bodyStr: string | undefined;
    if (opts.body !== undefined && opts.body !== null) {
      if (typeof opts.body === "string") {
        bodyStr = opts.body;
      } else {
        bodyStr = JSON.stringify(opts.body);
      }
    }

    let response: Response;
    try {
      response = await fetch(url, {
        method: opts.method,
        headers,
        body: bodyStr,
        signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
      });
    } catch (err) {
      if (err instanceof Error && (err.name === "AbortError" || err.name === "TimeoutError")) {
        throw new IvaApiError(
          408,
          `Request timed out after ${DEFAULT_TIMEOUT_MS}ms`,
          "REQUEST_TIMEOUT",
        );
      }
      throw err;
    }

    // Auto-relogin: if the cached session expired (401) and we auth via
    // login/password, force a re-login (deduped across concurrent callers)
    // and retry once.
    if (
      response.status === 401 &&
      opts.apiType === "clients" &&
      !isRetry &&
      this.canReauth()
    ) {
      await this.getFreshSessionToken(true);
      return this.doRequest<T>(opts, true);
    }

    const responseText = await response.text();

    if (response.ok || response.status === 204) {
      if (responseText.length === 0) {
        return { status: "success", code: response.status } as T;
      }
      try {
        return JSON.parse(responseText) as T;
      } catch {
        return responseText as unknown as T;
      }
    }

    let errorMessage = `HTTP ${response.status}`;
    let reason: string | undefined;
    let errorType: string | undefined;
    try {
      const errorData = JSON.parse(responseText);
      errorMessage = errorData.message || errorMessage;
      reason = errorData.reason;
      errorType = errorData.type;
    } catch {
      errorMessage = responseText || errorMessage;
    }

    throw new IvaApiError(response.status, errorMessage, reason, errorType);
  }

  // Forgets the auto-login session token (e.g. after a logout action) so the
  // next request re-authenticates instead of replaying a dead token. A static
  // IVA_SESSION_TOKEN stays in place — it is what the user configured.
  clearSessionToken(): void {
    this.cachedSessionToken = this.config.sessionToken;
    this.loginPromise = undefined;
  }

  isConfirmDestructive(): boolean {
    return this.config.confirmDestructive;
  }
}