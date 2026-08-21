import type { IvaConfig, ApiType, ApiRequestOptions, HttpMethod } from "./types.js";
import { IvaApiError } from "./error.js";

const DEFAULT_TIMEOUT_MS = 30000;

const API_PATHS: Record<ApiType, string> = {
  clients: "/api/rest",
  integration: "/api/rest/integration",
  bot: "/api/rest/bot",
};

export class IvaApiClient {
  private cachedSessionToken?: string;

  constructor(private config: IvaConfig) {
    this.cachedSessionToken = config.sessionToken;
  }

  private async getFreshSessionToken(): Promise<string> {
    if (this.cachedSessionToken) return this.cachedSessionToken;

    if (!this.config.login || !this.config.password) {
      throw new IvaApiError(
        401,
        "No authentication configured for Clients API. Set IVA_SESSION_TOKEN, IVA_JWT_TOKEN, or IVA_LOGIN + IVA_PASSWORD.",
        "AUTH_NOT_CONFIGURED",
      );
    }

    const url = `${this.config.baseUrl}/api/rest/login`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login: this.config.login, password: this.config.password }),
      signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
    });

    const data = await response.json() as { sessionId?: string };
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
      case "integration": {
        if (this.config.integrationToken) {
          headers["Authorization"] = `Bearer ${this.config.integrationToken}`;
        } else {
          throw new IvaApiError(
            401,
            "No authentication configured for Integration API. Set IVA_INTEGRATION_TOKEN.",
            "AUTH_NOT_CONFIGURED",
          );
        }
        break;
      }
      case "bot": {
        if (this.config.botToken) {
          headers["X-Iva-Bot-Api-Token"] = this.config.botToken;
        } else {
          throw new IvaApiError(
            401,
            "No authentication configured for Bot API. Set IVA_BOT_TOKEN.",
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

  async request<T = unknown>(opts: ApiRequestOptions): Promise<T> {
    const basePath = API_PATHS[opts.apiType];
    const fullPath = this.buildPath(opts.path, opts.pathParams);
    const queryString = this.buildQuery(opts.queryParams);
    const url = `${this.config.baseUrl}${basePath}${fullPath}${queryString}`;

    const authHeaders = await this.buildAuthHeaders(opts.apiType);
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...authHeaders,
      ...(opts.headers || {}),
    };

    let bodyStr: string | undefined;
    if (opts.body !== undefined && opts.body !== null) {
      if (typeof opts.body === "string" && opts.body === "{}") {
        bodyStr = "{}";
      } else if (typeof opts.body === "string") {
        bodyStr = opts.body;
      } else {
        bodyStr = JSON.stringify(opts.body);
      }
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

    let response: Response;
    try {
      response = await fetch(url, {
        method: opts.method,
        headers,
        body: bodyStr,
        signal: controller.signal,
      });
    } catch (err) {
      clearTimeout(timeout);
      if (err instanceof Error && err.name === "AbortError") {
        throw new IvaApiError(
          408,
          `Request timed out after ${DEFAULT_TIMEOUT_MS}ms`,
          "REQUEST_TIMEOUT",
        );
      }
      throw err;
    }
    clearTimeout(timeout);

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

  async get<T = unknown>(apiType: ApiType, path: string, opts?: {
    pathParams?: Record<string, string | number>;
    queryParams?: Record<string, unknown>;
  }): Promise<T> {
    return this.request<T>({ apiType, method: "GET", path, ...opts });
  }

  async post<T = unknown>(apiType: ApiType, path: string, opts?: {
    pathParams?: Record<string, string | number>;
    queryParams?: Record<string, unknown>;
    body?: unknown;
  }): Promise<T> {
    return this.request<T>({ apiType, method: "POST", path, ...opts });
  }

  async patch<T = unknown>(apiType: ApiType, path: string, opts?: {
    pathParams?: Record<string, string | number>;
    queryParams?: Record<string, unknown>;
    body?: unknown;
  }): Promise<T> {
    return this.request<T>({ apiType, method: "PATCH", path, ...opts });
  }

  async put<T = unknown>(apiType: ApiType, path: string, opts?: {
    pathParams?: Record<string, string | number>;
    queryParams?: Record<string, unknown>;
    body?: unknown;
  }): Promise<T> {
    return this.request<T>({ apiType, method: "PUT", path, ...opts });
  }

  async delete<T = unknown>(apiType: ApiType, path: string, opts?: {
    pathParams?: Record<string, string | number>;
    queryParams?: Record<string, unknown>;
  }): Promise<T> {
    return this.request<T>({ apiType, method: "DELETE", path, ...opts });
  }

  get baseUrl(): string {
    return this.config.baseUrl;
  }

  getAuthHeaders(apiType: ApiType): Promise<Record<string, string>> {
    return this.buildAuthHeaders(apiType);
  }

  isConfirmDestructive(): boolean {
    return this.config.confirmDestructive;
  }
}