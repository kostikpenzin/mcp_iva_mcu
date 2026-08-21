export type ApiType = "clients" | "integration" | "bot";

export interface IvaConfig {
  baseUrl: string;
  sessionToken?: string;
  jwtToken?: string;
  integrationToken?: string;
  botToken?: string;
  login?: string;
  password?: string;
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, unknown>;
    required: string[];
  };
  handler: (args: Record<string, unknown>) => Promise<ToolResult>;
}

export interface ToolResult {
  content: { type: "text"; text: string }[];
  isError?: boolean;
}

export type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export interface ApiRequestOptions {
  apiType: ApiType;
  method: HttpMethod;
  path: string;
  pathParams?: Record<string, string | number>;
  queryParams?: Record<string, unknown>;
  body?: unknown;
  headers?: Record<string, string>;
}