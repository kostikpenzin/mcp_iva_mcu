import type { IvaApiClient } from "../../api-client.js";
import type { ToolDefinition } from "../../types.js";
import { createActionTool } from "../framework.js";
import { P } from "../params.js";

export function createChatTool(client: IvaApiClient): ToolDefinition {
  return createActionTool(
    "iva_chat",
    "IVA chat management: create group chat, get/search/update/delete chats, forward messages, clear history, manage notifications, get P2P chat, get muted chats. Clients API v2.28.12.",
    [
      "create_group_chat", "get", "delete", "update", "search",
      "get_p2p", "get_all", "forward_messages", "clear_history",
      "allow_notifications", "forbid_notifications", "get_muted",
      "set_p2p_notifications",
    ],
    {
      chatRoomId: P.chatRoomId,
      participants: P.participants,
      chatUpdate: { type: "object", description: "Chat room properties to update" },
      query: P.query,
      messageIds: P.messageIds,
      forwardData: { type: "object", description: "Forward messages data {messageIds, targetChatRoomIds}" },
      notificationData: { type: "object", description: "P2P notification settings" },
      limit: P.limit,
      offset: P.offset,
      dateFrom: P.dateFrom,
      dateTo: P.dateTo,
      targetProfileId: P.targetProfileId,
    },
    {
      create_group_chat: { apiType: "clients", method: "POST", path: "/chats/create-group-chat", bodyParam: "participants", bodyWrapper: "participants" },
      get: { apiType: "clients", method: "GET", path: "/chats/{chatRoomId}", pathParams: ["chatRoomId"] },
      delete: { apiType: "clients", method: "DELETE", path: "/chats/{chatRoomId}", pathParams: ["chatRoomId"] },
      update: { apiType: "clients", method: "PATCH", path: "/chats/{chatRoomId}", pathParams: ["chatRoomId"], bodyParam: "chatUpdate" },
      search: { apiType: "clients", method: "GET", path: "/chats/search", queryParams: ["query", "limit", "offset"] },
      get_p2p: { apiType: "clients", method: "GET", path: "/chats/p2p", queryParams: ["targetProfileId"] },
      get_all: { apiType: "clients", method: "GET", path: "/chats", queryParams: ["dateFrom", "dateTo", "limit", "offset"] },
      forward_messages: { apiType: "clients", method: "POST", path: "/chats/forward-messages", bodyParam: "forwardData" },
      clear_history: { apiType: "clients", method: "POST", path: "/chats/{chatRoomId}/clear-history", pathParams: ["chatRoomId"], emptyBody: true },
      allow_notifications: { apiType: "clients", method: "POST", path: "/chats/{chatRoomId}/allow-notifications", pathParams: ["chatRoomId"], emptyBody: true },
      forbid_notifications: { apiType: "clients", method: "POST", path: "/chats/{chatRoomId}/forbid-notifications", pathParams: ["chatRoomId"], emptyBody: true },
      get_muted: { apiType: "clients", method: "GET", path: "/chats/muted-chat-ids" },
      set_p2p_notifications: { apiType: "clients", method: "POST", path: "/chats/p2p-chat-notifications", bodyParam: "notificationData" },
    },
    client,
  );
}