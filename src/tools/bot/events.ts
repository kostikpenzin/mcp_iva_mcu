import type { IvaWsClient } from "../../ws-client.js";
import type { ToolDefinition } from "../../types.js";
import { errorResult, successResult } from "../../error.js";

export function createBotEventsTool(wsClient: IvaWsClient): ToolDefinition {
  return {
    name: "iva_bot_events",
    description:
      "IVA Bot API — collect chat events (updates) via WebSocket long-poll. Returns an array of event objects received during the collection period. Bot API v1.28.12.",
    inputSchema: {
      type: "object",
      properties: {
        duration: {
          type: "integer",
          description: "How long to collect events in seconds (default 10, max 60)",
          default: 10,
        },
      },
      required: [],
    },
    handler: async (args) => {
      const duration = Math.min(Number(args.duration) || 10, 60);
      try {
        const events = await wsClient.collectEvents({
          apiType: "bot",
          wsPath: "/botEventsChannel/chats",
          duration,
        });
        return successResult(events);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return errorResult(message);
      }
    },
  };
}