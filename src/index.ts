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
    { name: "mcp-iva-mcu", version: "1.2.0" },
    {
      capabilities: {
        tools: {},
      },
      instructions:
        "IVA MCU MCP server. Provides 40 tools covering IVA Clients API (v2.28.12), Integration API (v1.28.12), and Bot API (v1.28.12). Each tool uses an 'action' parameter to select the specific operation.\n\n" +
        "NATURAL LANGUAGE MAPPING (Russian/English → tool + action):\n" +
        "Conferences/meetings/events (встреча, мероприятие, конференция, собрание, планёрка, webinar, meeting, conference, event, book, schedule, create):\n" +
        "  - Create/schedule/book a meeting → iva_conference action=create (requires conferenceData with name + startDate in UNIX ms)\n" +
        "  - Get meeting info → iva_conference action=get (requires conferenceId)\n" +
        "  - Delete meeting → iva_conference action=delete\n" +
        "  - Start meeting now → iva_conference action=start_now\n" +
        "  - List/find meetings → iva_conference_session action=find\n" +
        "  - Get session details → iva_conference_session action=get (requires conferenceSessionId)\n" +
        "  - Join session → iva_conference_session action=join\n" +
        "  - Leave session → iva_conference_session action=leave\n" +
        "  - Start recording → iva_conference_session action=start_recording\n" +
        "  - Stop recording → iva_conference_session action=stop_recording\n" +
        "  - Start transcription → iva_conference_session action=start_transcription\n\n" +
        "Conference participants (участники, пригласить, убрать, muted, микрофон, рука, reaction):\n" +
        "  - Add participants → iva_conference_participants action=add\n" +
        "  - Remove participants → iva_conference_participants action=remove\n" +
        "  - Mute participant → iva_conference_participants action=mute_media\n" +
        "  - Raise hand → iva_conference_participants action=hand_up\n" +
        "  - Set reaction → iva_conference_participants action=set_reaction\n\n" +
        "Chat/messages (чат, сообщение, написать, отправить, forward, переслать):\n" +
        "  - Send message → iva_chat_messages action=send\n" +
        "  - Create group chat → iva_chat action=create_group_chat\n" +
        "  - Search chats → iva_chat action=search\n\n" +
        "Profile/user (профиль, пользователь, пароль, настройки):\n" +
        "  - Get profile → iva_profile action=get\n" +
        "  - Update profile → iva_profile action=update\n" +
        "  - Change password → iva_profile action=update_password\n\n" +
        "Contacts (контакты, найти пользователя, presence, статус):\n" +
        "  - Search contacts → iva_contacts action=get\n" +
        "  - Invite contact → iva_contacts action=invite\n\n" +
        "Integration API (управление пользователями, компаниями, группами):\n" +
        "  - Create user → iva_integration_users action=create\n" +
        "  - Create company → iva_integration_companies action=create\n\n" +
        "All UUID parameters must be valid UUIDs. Dates are UNIX timestamps in milliseconds.",
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