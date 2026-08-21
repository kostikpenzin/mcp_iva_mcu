#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { loadConfig } from "./config.js";
import { IvaApiClient } from "./api-client.js";
import { getAllTools } from "./tools/index.js";
import type { ToolDefinition } from "./types.js";
import { IvaApiError, errorResult, apiErrorResult } from "./error.js";

async function main() {
  const config = loadConfig();
  const apiClient = new IvaApiClient(config);

  const tools = getAllTools(apiClient);
  const toolMap = new Map<string, ToolDefinition>(tools.map((t) => [t.name, t]));

  const server = new Server(
    { name: "mcp-iva-mcu", version: "1.1.0" },
    {
      capabilities: {
        tools: {},
      },
      instructions:
        "IVA MCU MCP server. Provides 40 tools covering IVA Clients API (v2.28.12), Integration API (v1.28.12), and Bot API (v1.28.12). Each tool uses an 'action' parameter to select the specific operation.",
    },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: tools.map((t) => ({
        name: t.name,
        description: t.description,
        inputSchema: t.inputSchema,
      })),
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request): Promise<Record<string, unknown>> => {
    const toolName = request.params.name;
    const args = (request.params.arguments || {}) as Record<string, unknown>;

    const tool = toolMap.get(toolName);
    if (!tool) {
      return errorResult(`Unknown tool: ${toolName}`) as unknown as Record<string, unknown>;
    }

    try {
      return await tool.handler(args) as unknown as Record<string, unknown>;
    } catch (err) {
      if (err instanceof IvaApiError) {
        return apiErrorResult(err) as unknown as Record<string, unknown>;
      }
      const message = err instanceof Error ? err.message : String(err);
      return errorResult(message) as unknown as Record<string, unknown>;
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);

  const shutdown = async () => {
    try {
      await server.close();
      await transport.close();
    } catch {
      // ignore
    }
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});