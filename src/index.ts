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
    { name: "mcp-iva-mcu", version: "1.3.2" },
    {
      capabilities: {
        tools: {},
      },
      instructions:
        "IVA MCU MCP server. Provides 40 tools covering IVA Clients API (v2.28.12), Integration API (v1.28.12), and Bot API (v1.28.12). Each tool uses an 'action' parameter to select the specific operation.\n\n" +
        "NATURAL LANGUAGE MAPPING (Russian/English → tool + action):\n\n" +
        "CONFERENCES & MEETINGS (встреча, мероприятие, конференция, собрание, планёрка, webинар, meeting, conference, event, webinar, book, schedule, create):\n" +
        "  - Create/schedule/book a meeting → iva_conference action=create (requires conferenceData with name + startDate in UNIX ms)\n" +
        "  - Get meeting info → iva_conference action=get\n" +
        "  - Update meeting → iva_conference action=update\n" +
        "  - Delete/cancel meeting → iva_conference action=delete (удали встречу, cancel meeting)\n" +
        "  - Start meeting now → iva_conference action=start_now (начни сейчас, start now)\n" +
        "  - Create room → iva_conference action=create_room (создай комнату, create room)\n\n" +
        "CONFERENCE SESSIONS (сессия, session, запись, транскрипция, запись экрана, join, войти, выйти, recording, transcription):\n" +
        "  - List/find sessions → iva_conference_session action=find (покажи встречи, list meetings, найди конференцию)\n" +
        "  - Get session details → iva_conference_session action=get\n" +
        "  - Join session → iva_conference_session action=join (войди в конференцию, join meeting)\n" +
        "  - Leave session → iva_conference_session action=leave (выйди, leave)\n" +
        "  - Start/stop session → iva_conference_session action=start/stop\n" +
        "  - Start recording → iva_conference_session action=start_recording (начни запись, start recording)\n" +
        "  - Stop recording → iva_conference_session action=stop_recording (останови запись, stop recording)\n" +
        "  - Start transcription → iva_conference_session action=start_transcription (включи транскрипцию, start transcription)\n" +
        "  - Stop transcription → iva_conference_session action=stop_transcription\n\n" +
        "PARTICIPANTS (участники, пригласить, убрать, muted, микрофон, рука, reaction, реакция, DTMF):\n" +
        "  - Add participants → iva_conference_participants action=add (добавь участников, add participants)\n" +
        "  - Remove participants → iva_conference_participants action=remove (удали участников, remove participants)\n" +
        "  - Mute participant → iva_conference_participants action=mute_media (выключи микрофон, mute participant)\n" +
        "  - Unmute participant → iva_conference_participants action=unmute_media (включи микрофон, unmute)\n" +
        "  - Mute all → iva_conference_participants action=mute_media_all (замуть всех, mute all)\n" +
        "  - Raise hand → iva_conference_participants action=hand_up (поднять руку, raise hand)\n" +
        "  - Lower hand → iva_conference_participants action=hand_down (опусти руку, lower hand)\n" +
        "  - Set reaction → iva_conference_participants action=set_reaction (поставь реакцию, set reaction)\n" +
        "  - Disconnect → iva_conference_participants action=disconnect (отключи участника, disconnect)\n\n" +
        "CHAT & MESSAGES (чат, сообщение, написать, отправить, переслать, forward, chat, message, send, личное сообщение, в личку, direct message):\n" +
        "  - Get/create P2P (direct) chat → iva_chat action=get_p2p with profileId of recipient (найди личный чат, send direct message, напиши в личку). Use this for 1-on-1 messages, NOT create_group_chat.\n" +
        "  - Create group chat → iva_chat action=create_group_chat (создай групповой чат, create group chat). Only for multi-user chats.\n" +
        "  - Search chats → iva_chat action=search (найди чат, search chats)\n" +
        "  - Send message → iva_chat_messages action=send (отправь сообщение, send message). messageData must use field 'message' not 'text': {\"message\": \"hello\"}\n" +
        "  - Edit message → iva_chat_messages action=edit (редактируй сообщение, edit message)\n" +
        "  - Delete message → iva_chat_messages action=delete (удали сообщение, delete message)\n" +
        "  - Forward messages → iva_chat action=forward_messages (перешли сообщения, forward messages)\n" +
        "  - Star messages → iva_chat_messages action=star (отметь сообщение, star message)\n\n" +
        "CHAT CALLS (звонок, вызов, call, join call, hold, transfer, screenshare):\n" +
        "  - Join call → iva_chat_call action=join (войди в звонок, join call)\n" +
        "  - Leave call → iva_chat_call action=leave (покинь звонок, leave call)\n" +
        "  - Hold call → iva_chat_call action=hold (поставь на удержание, hold call)\n" +
        "  - Transfer call → iva_chat_call action=transfer_to_user (переведи звонок, transfer call)\n\n" +
        "PROFILE & USER (профиль, пользователь, настройки, диск, profile, user, settings, disk):\n" +
        "  - Get profile → iva_profile action=get (покажи профиль, get my profile)\n" +
        "  - Update profile → iva_profile action=update (обнови профиль, update profile)\n" +
        "  - Disk usage → iva_profile action=get_disk_utilization (сколько места, disk usage)\n" +
        "  - Password requirements → iva_profile action=get_password_requirements (требования к паролю, password rules)\n" +
        "  Note: password change/recovery and login actions are excluded for security. Authentication is handled automatically via IVA_LOGIN/IVA_PASSWORD environment variables.\n\n" +
        "CONTACTS (контакты, найти пользователя, presence, статус, контакты, contacts, find user, presence):\n" +
        "  - List contacts → iva_contacts action=get (покажи контакты, list contacts)\n" +
        "  - Invite contact → iva_contacts action=invite (пригласи контакт, invite contact)\n" +
        "  - Get presences → iva_contacts action=get_presences (кто онлайн, who is online)\n\n" +
        "DOCUMENTS & FILES (документы, файлы, загрузить, скачать, конвертировать, documents, files, upload, download, convert):\n" +
        "  - Convert document → iva_documents action=convert (конвертируй документ, convert document)\n" +
        "  - Delete document → iva_documents action=delete (удали документ, delete document)\n" +
        "  - Upload file → iva_file_resources action=upload (загрузи файл, upload file)\n" +
        "  - Download file → iva_file_resources action=download (скачай файл, download file)\n\n" +
        "CONFERENCE DOCUMENTS (документы конференции, демонстрация, presentation, демонстрация документа):\n" +
        "  - Create document → iva_conference_documents action=create_document\n" +
        "  - Start document demo → iva_conference_documents action=start_document_demo (покажи документ, present document)\n" +
        "  - Stop document demo → iva_conference_documents action=stop_document_demo (останови демонстрацию, stop presentation)\n\n" +
        "WHITEBOARD (белая доска, интерактивная доска, whiteboard, презентация):\n" +
        "  - Start whiteboard demo → iva_whiteboard action=start_demo (покажи доску, start whiteboard)\n" +
        "  - Stop whiteboard demo → iva_whiteboard action=stop_demo (останови доску, stop whiteboard)\n" +
        "  - Add book → iva_whiteboard action=add_book (создай книгу, add book)\n\n" +
        "SCREENSHARE (демонстрация экрана, share screen, экран, screenshare):\n" +
        "  - Start screenshare → iva_screenshare action=start_web_screenshare (покажи экран, share screen)\n" +
        "  - Stop screenshare → iva_screenshare action=stop_web_screenshare (останови демонстрацию, stop screenshare)\n\n" +
        "POLLS & INQUIRIES (опрос, голосование, poll, vote, inquiry):\n" +
        "  - Create poll → iva_conference_inquiry action=create (создай опрос, create poll)\n" +
        "  - Start poll → iva_conference_inquiry action=start (запусти опрос, start poll)\n" +
        "  - Stop poll → iva_conference_inquiry action=stop (останови опрос, stop poll)\n\n" +
        "LOBBY (зал ожидания, лобби, lobby, waiting room):\n" +
        "  - Join lobby → iva_conference_lobby action=join (войди в зал ожидания, join lobby)\n" +
        "  - Approve participant → iva_conference_lobby action=approve (одобри участника, approve participant)\n" +
        "  - Reject participant → iva_conference_lobby action=reject (отклони участника, reject participant)\n\n" +
        "STATISTICS (статистика, отчёт, analytics, statistics, report):\n" +
        "  - Get statistics → iva_conference_statistics action=get (покажи статистику, get statistics)\n" +
        "  - Export statistics → iva_conference_statistics action=export (экспортируй статистику, export statistics)\n\n" +
        "TEMPLATES (шаблон, template, шаблоны конференций):\n" +
        "  - Create template → iva_conference_templates action=create (создай шаблон, create template)\n" +
        "  - List templates → iva_conference_templates action=get_all (покажи шаблоны, list templates)\n\n" +
        "SYSTEM (система, системная информация, media, ICE, system info):\n" +
        "  - Get system info → iva_system action=get_info (системная информация, system info)\n" +
        "  - Get ICE servers → iva_system action=get_ice_servers (ICE серверы, ICE servers)\n\n" +
        "INTEGRATION API (управление пользователями, компаниями, группами, admin, manage users, companies):\n" +
        "  - Create user → iva_integration_users action=create (создай пользователя, create user)\n" +
        "  - Block/unblock user → iva_integration_users action=block/unblock (заблокируй/разблокируй пользователя)\n" +
        "  - Create company → iva_integration_companies action=create (создай компанию, create company)\n" +
        "  - Create group → iva_integration_groups action=create (создай группу, create group)\n\n" +
        "BOT API (бот, отправить от имени бота, bot, send as bot):\n" +
        "  - Send bot message → iva_bot_chat action=send_message (бот отправь сообщение, bot send message)\n\n" +
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