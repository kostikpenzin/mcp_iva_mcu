import type { IvaApiClient } from "../../api-client.js";
import type { ToolDefinition } from "../../types.js";
import { createActionTool } from "../framework.js";
import { P } from "../params.js";
import { API_VERSION } from "../../constants.js";

export function createChatMessagesTool(client: IvaApiClient): ToolDefinition {
  return createActionTool(
    "iva_chat_messages",
    `IVA chat messages: send/edit/delete/star messages, search attachments, get messages/changes/starred, typing notification, read receipt. Clients API ${API_VERSION}.`,
    [
      "send", "send_audio", "edit", "delete", "delete_multiple",
      "get", "get_changes", "get_starred", "search_attachments",
      "remove_attachment", "star", "unstar", "typing", "notify_read",
    ],
    {
      chatRoomId: P.chatRoomId,
      messageId: P.messageId,
      messageIds: P.messageIds,
      messageData: { type: "object", description: "Message data. Use {\"message\": \"text here\"} for text messages. Field is 'message' not 'text'." },
      audioData: { type: "object", description: "Audio message data" },
      messageEdit: { type: "object", description: "Message edit content" },
      attachmentId: P.resourceId,
      searchCriteria: { type: "object", description: "Attachment search criteria" },
      typingData: { type: "object", description: "Typing notification data" },
      readData: { type: "object", description: "Read receipt data" },
      limit: P.limit,
      offset: P.offset,
      dateFrom: P.dateFrom,
      dateTo: P.dateTo,
      textContains: { type: "string", description: "Filter messages containing text" },
      size: { type: "integer", description: "Page size" },
      orderAsc: { type: "boolean", description: "Order ascending" },
      onlyChanged: { type: "boolean", description: "Only changed messages" },
    },
    {
      send: { apiType: "clients", method: "POST", path: "/chats/{chatRoomId}/send-message", pathParams: ["chatRoomId"], bodyParam: "messageData" },
      send_audio: { apiType: "clients", method: "POST", path: "/chats/{chatRoomId}/send-audio-message", pathParams: ["chatRoomId"], bodyParam: "audioData" },
      edit: { apiType: "clients", method: "PATCH", path: "/chats/{chatRoomId}/messages/{messageId}", pathParams: ["chatRoomId", "messageId"], bodyParam: "messageEdit" },
      delete: { apiType: "clients", method: "DELETE", path: "/chats/{chatRoomId}/messages/{messageId}", pathParams: ["chatRoomId", "messageId"] },
      delete_multiple: { apiType: "clients", method: "POST", path: "/chats/{chatRoomId}/messages/remove", pathParams: ["chatRoomId"], bodyParam: "messageIds" },
      get: { apiType: "clients", method: "GET", path: "/chats/{chatRoomId}/messages", pathParams: ["chatRoomId"], queryParams: ["textContains", "dateFrom", "dateTo", "size", "orderAsc"] },
      get_changes: { apiType: "clients", method: "GET", path: "/chats/{chatRoomId}/messages/changes", pathParams: ["chatRoomId"], queryParams: ["dateFrom", "size", "onlyChanged"] },
      get_starred: { apiType: "clients", method: "GET", path: "/chats/{chatRoomId}/messages/starred", pathParams: ["chatRoomId"], queryParams: ["textContains", "dateFrom", "size"] },
      search_attachments: { apiType: "clients", method: "POST", path: "/chats/{chatRoomId}/chat-attachments/find-by-criteria", pathParams: ["chatRoomId"], bodyParam: "searchCriteria" },
      remove_attachment: { apiType: "clients", method: "DELETE", path: "/chats/{chatRoomId}/chat-attachments/{attachmentId}", pathParams: ["chatRoomId", "attachmentId"] },
      star: { apiType: "clients", method: "POST", path: "/chats/{chatRoomId}/star-messages", pathParams: ["chatRoomId"], bodyParam: "messageIds" },
      unstar: { apiType: "clients", method: "POST", path: "/chats/{chatRoomId}/unstar-messages", pathParams: ["chatRoomId"], bodyParam: "messageIds" },
      typing: { apiType: "clients", method: "POST", path: "/chats/{chatRoomId}/typing", pathParams: ["chatRoomId"], bodyParam: "typingData" },
      notify_read: { apiType: "clients", method: "POST", path: "/chats/{chatRoomId}/last-read-at", pathParams: ["chatRoomId"], bodyParam: "readData" },
    },
    client,
    {
      send: "Send a text message to a chat. Use when user says 'отправь сообщение', 'send message'. Required: chatRoomId, messageData with text.",
      send_audio: "Send an audio message to a chat",
      edit: "Edit an existing message",
      delete: "Delete a single message",
      delete_multiple: "Delete multiple messages at once. Required: chatRoomId, messageIds array.",
      get: "Get messages from a chat (paginated)",
      get_changes: "Get message changes since a timestamp",
      get_starred: "Get starred/favorited messages",
      search_attachments: "Search for attachments in a chat",
      remove_attachment: "Remove an attachment from a message",
      star: "Star/favorite messages. Required: chatRoomId, messageIds array.",
      unstar: "Remove star from messages",
      typing: "Send typing notification",
      notify_read: "Mark messages as read",
    },
  );
}