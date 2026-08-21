import type { IvaApiClient } from "../../api-client.js";
import type { ToolDefinition } from "../../types.js";
import { createActionTool } from "../framework.js";
import { P } from "../params.js";

export function createIntegrationChatsTool(client: IvaApiClient): ToolDefinition {
  return createActionTool(
    "iva_integration_chats",
    "IVA Integration API — chat management: create/get/delete chats, add/remove participants, get/get participants of calls, find call documents, get/create P2P chat. Integration API v1.28.12.",
    [
      "create_group_chat", "get", "delete", "add_participants", "remove_participants",
      "get_participants", "get_p2p",
      "get_call", "get_calls", "get_call_participants", "find_call_documents",
    ],
    {
      chatId: P.chatRoomId,
      callId: P.callId,
      participants: P.participants,
      participantIds: P.participantIds,
      p2pData: { type: "object", description: "P2P chat creation data" },
      limit: P.limit,
      offset: P.offset,
    },
    {
      create_group_chat: { apiType: "integration", method: "POST", path: "/chats/create-group-chat", bodyParam: "participants", bodyWrapper: "participants" },
      get: { apiType: "integration", method: "GET", path: "/chats/{chatId}", pathParams: ["chatId"] },
      delete: { apiType: "integration", method: "DELETE", path: "/chats/{chatId}", pathParams: ["chatId"] },
      add_participants: { apiType: "integration", method: "POST", path: "/chats/{chatId}/participants/add", pathParams: ["chatId"], bodyParam: "participants", bodyWrapper: "participants" },
      remove_participants: { apiType: "integration", method: "POST", path: "/chats/{chatId}/participants/remove", pathParams: ["chatId"], bodyParam: "participantIds", bodyWrapper: "participantIds" },
      get_participants: { apiType: "integration", method: "GET", path: "/chats/{chatId}/participants", pathParams: ["chatId"] },
      get_p2p: { apiType: "integration", method: "POST", path: "/chats/p2p", bodyParam: "p2pData" },
      get_call: { apiType: "integration", method: "GET", path: "/chats/{chatId}/call", pathParams: ["chatId"] },
      get_calls: { apiType: "integration", method: "GET", path: "/chats/calls", queryParams: ["limit", "offset"] },
      get_call_participants: { apiType: "integration", method: "GET", path: "/chats/{chatId}/call/{callId}/participants", pathParams: ["chatId", "callId"] },
      find_call_documents: { apiType: "integration", method: "GET", path: "/chats/{chatId}/call/{callId}/documents", pathParams: ["chatId", "callId"], queryParams: ["limit", "offset"] },
    },
    client,
    {
      create_group_chat: "Создать групповой чат / Create a new group chat.",
      get: "Получить информацию о чате / Get chat information by chatId.",
      delete: "Удалить чат / Delete a chat.",
      add_participants: "Добавить участников в чат / Add participants to a chat.",
      remove_participants: "Удалить участников из чата / Remove participants from a chat.",
      get_participants: "Получить участников чата / Get chat participants.",
      get_p2p: "Создать или получить персональный чат / Get or create a P2P chat between users.",
      get_call: "Получить информацию о звонке в чате / Get information about a chat call.",
      get_calls: "Получить список звонков / Get list of calls.",
      get_call_participants: "Получить участников звонка / Get participants of a call.",
      find_call_documents: "Найти документы звонка / Find documents of a call.",
    },
  );
}