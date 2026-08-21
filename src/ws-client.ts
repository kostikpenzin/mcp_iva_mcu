import WebSocket from "ws";
import type { IvaConfig, ApiType } from "./types.js";
import { IvaApiError } from "./error.js";

const API_PATHS: Record<ApiType, string> = {
  clients: "/api/rest",
  integration: "/api/rest/integration",
  bot: "/api/rest/bot",
};

export interface WsEventOptions {
  apiType: ApiType;
  wsPath: string;
  pathParams?: Record<string, string | number>;
  duration: number;
}

export class IvaWsClient {
  constructor(private config: IvaConfig) {}

  private getAuthParams(apiType: ApiType): string {
    switch (apiType) {
      case "clients":
        if (this.config.sessionToken) {
          return `?session=${encodeURIComponent(this.config.sessionToken)}`;
        } else if (this.config.jwtToken) {
          return `?token=${encodeURIComponent(this.config.jwtToken)}`;
        }
        throw new IvaApiError(401, "No auth for WebSocket Clients API", "AUTH_NOT_CONFIGURED");
      case "bot":
        if (this.config.botToken) {
          return `?token=${encodeURIComponent(this.config.botToken)}`;
        }
        throw new IvaApiError(401, "No auth for WebSocket Bot API", "AUTH_NOT_CONFIGURED");
      default:
        return "";
    }
  }

  async collectEvents(opts: WsEventOptions): Promise<unknown[]> {
    const basePath = API_PATHS[opts.apiType];
    let wsPath = opts.wsPath;
    if (opts.pathParams) {
      for (const [key, value] of Object.entries(opts.pathParams)) {
        wsPath = wsPath.replace(`{${key}}`, encodeURIComponent(String(value)));
      }
    }

    const httpBaseUrl = this.config.baseUrl.replace(/^http/, "ws");
    const wsUrl = `${httpBaseUrl}${basePath}${wsPath}`;

    const authParams = this.getAuthParams(opts.apiType);
    const fullUrl = wsUrl.includes("?") ? `${wsUrl}&${authParams.slice(1)}` : `${wsUrl}${authParams}`;

    return new Promise<unknown[]>((resolve, reject) => {
      const events: unknown[] = [];
      const timeout = opts.duration * 1000;
      let settled = false;

      const ws = new WebSocket(fullUrl);

      const cleanup = (ws: WebSocket) => {
        try {
          if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
            ws.close();
          }
        } catch { /* noop */ }
      };

      const finish = () => {
        if (settled) return;
        settled = true;
        cleanup(ws);
        resolve(events);
      };

      ws.on("message", (data: WebSocket.RawData) => {
        const text = data.toString();
        try {
          events.push(JSON.parse(text));
        } catch {
          events.push(text);
        }
      });

      ws.on("error", (err: Error) => {
        if (!settled) {
          settled = true;
          reject(new Error(`WebSocket error: ${err.message}`));
        }
      });

      ws.on("close", () => {
        if (!settled) {
          settled = true;
          resolve(events);
        }
      });

      ws.on("open", () => {
        setTimeout(finish, timeout);
      });

      // Fallback timeout even if connection not opened
      setTimeout(finish, timeout + 5000);
    });
  }
}