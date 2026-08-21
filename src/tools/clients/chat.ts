import type { IvaApiClient } from "../../api-client.js";
import type { ToolDefinition } from "../../types.js";
import { createActionTool } from "../framework.js";
import { P } from "../params.js";

function fillChatNames(action: string, data: unknown): unknown {
  if (!data) return data;

  const fillName = (chat: Record<string, unknown>): Record<string, unknown> => {
    const name = chat.name as string | undefined;
    if (name && name.trim()) return chat;
    const users = chat.users as Array<Record<string, unknown>> | undefined;
    if (users && users.length > 0) {
      const names = users
        .map((u) => u.name as string)
        .filter(Boolean);
      if (names.length > 0) {
        chat.name = names.join(", ");
      }
    }
    return chat;
  };

  if (action === "get_all" || action === "search") {
    if (Array.isArray(data)) {
      return data.map(fillName);
    }
    if (typeof data === "object" && data !== null) {
      const obj = data as Record<string, unknown>;
      if (Array.isArray(obj.data)) {
        obj.data = (obj.data as Record<string, unknown>[]).map(fillName);
      }
    }
  } else if (action === "get_p2p" || action === "get") {
    if (typeof data === "object" && data !== null && !Array.isArray(data)) {
      return fillName(data as Record<string, unknown>);
    }
  }

  return data;
}

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
      searchCriteria: { type: "string", description: "Search criteria" },
      size: { type: "integer", description: "Page size" },
      olderThan: { type: "integer", description: "Get chats older than this timestamp (ms)" },
      profileId: P.profileId,
      contactId: P.contactId,
      email: P.email,
      phone: P.phone,
      name: P.name,
    },
    {
      create_group_chat: { apiType: "clients", method: "POST", path: "/chats/create-group-chat", bodyParam: "participants" },
      get: { apiType: "clients", method: "GET", path: "/chats/{chatRoomId}", pathParams: ["chatRoomId"] },
      delete: { apiType: "clients", method: "DELETE", path: "/chats/{chatRoomId}", pathParams: ["chatRoomId"] },
      update: { apiType: "clients", method: "PATCH", path: "/chats/{chatRoomId}", pathParams: ["chatRoomId"], bodyParam: "chatUpdate" },
      search: { apiType: "clients", method: "GET", path: "/chats/search", queryParams: ["searchCriteria", "size"] },
      get_p2p: { apiType: "clients", method: "GET", path: "/chats/p2p", queryParams: ["profileId", "contactId", "email", "phone", "name"] },
      get_all: { apiType: "clients", method: "GET", path: "/chats", queryParams: ["olderThan", "size"] },
      forward_messages: { apiType: "clients", method: "POST", path: "/chats/forward-messages", bodyParam: "forwardData" },
      clear_history: { apiType: "clients", method: "POST", path: "/chats/{chatRoomId}/clear-history", pathParams: ["chatRoomId"], emptyBody: true },
      allow_notifications: { apiType: "clients", method: "POST", path: "/chats/{chatRoomId}/allow-notifications", pathParams: ["chatRoomId"], emptyBody: true },
      forbid_notifications: { apiType: "clients", method: "POST", path: "/chats/{chatRoomId}/forbid-notifications", pathParams: ["chatRoomId"], emptyBody: true },
      get_muted: { apiType: "clients", method: "GET", path: "/chats/muted-chat-ids" },
      set_p2p_notifications: { apiType: "clients", method: "POST", path: "/chats/p2p-chat-notifications", bodyParam: "notificationData" },
    },
    client,
    {
      create_group_chat: "Create a group chat. Use when user says 'создай чат', 'create group chat'. Required: participants array.",
      get: "Get chat details by ID",
      delete: "Delete a chat",
      update: "Update chat properties (name, avatar, etc.)",
      search: "Search chats by query. Use when user says 'найди чат', 'search chats'.",
      get_p2p: "Get or create a P2P (direct/private) chat with a specific user. Use this for sending direct messages to a person — NOT create_group_chat. Pass profileId of the recipient. Use when user says 'напиши в личку', 'send direct message', 'найди личный чат'. At least one of: profileId, contactId, email, phone, name.",
      get_all: "Get all chats (paginated by date). Chats without names will show participant names as the title.",
      forward_messages: "Forward messages to another chat. Required: forwardData with messageIds and targetChatRoomIds.",
      clear_history: "Clear chat history",
      allow_notifications: "Enable notifications for a chat",
      forbid_notifications: "Disable notifications for a chat",
      get_muted: "Get list of muted chat IDs",
      set_p2p_notifications: "Set P2P chat notification settings",
    },
    fillChatNames,
  );
}