import type { IvaApiClient } from "../../api-client.js";
import type { ToolDefinition } from "../../types.js";
import { createActionTool } from "../framework.js";
import { P } from "../params.js";
import { API_VERSION } from "../../constants.js";

export function createConferenceChatTool(client: IvaApiClient): ToolDefinition {
  return createActionTool(
    "iva_conference_chat",
    `IVA conference chat messages: send/edit/remove/moderate messages, get messages/participant-targets, export to txt, typing notification, remove all messages. Clients API ${API_VERSION}.`,
    [
      "send", "edit", "remove", "remove_all", "remove_all_for_participant",
      "get", "get_participant_targets", "export_txt",
      "moderate", "typing",
    ],
    {
      conferenceSessionId: P.conferenceSessionId,
      messageId: P.messageId,
      messageData: { type: "object", description: "Message data to send" },
      messageEdit: { type: "object", description: "Message edit content" },
      removeData: { type: "object", description: "Remove data (messageIds)" },
      moderateData: { type: "object", description: "Moderate data" },
      typingData: { type: "object", description: "Typing notification data" },
      participantId: P.participantId,
      limit: P.limit,
      offset: P.offset,
      dateFrom: P.dateFrom,
      dateTo: P.dateTo,
      textContains: { type: "string", description: "Filter messages containing text" },
      size: { type: "integer", description: "Page size" },
      orderAsc: { type: "boolean", description: "Order ascending" },
    },
    {
      send: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/messages/send", pathParams: ["conferenceSessionId"], bodyParam: "messageData" },
      edit: { apiType: "clients", method: "PATCH", path: "/conference-sessions/{conferenceSessionId}/messages/{messageId}", pathParams: ["conferenceSessionId", "messageId"], bodyParam: "messageEdit" },
      remove: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/messages/remove", pathParams: ["conferenceSessionId"], bodyParam: "removeData" },
      remove_all: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/messages/remove-all", pathParams: ["conferenceSessionId"], emptyBody: true },
      remove_all_for_participant: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/messages/remove-all-for-participant", pathParams: ["conferenceSessionId"], bodyParam: "participantId", bodyWrapper: "authorParticipantId" },
      get: { apiType: "clients", method: "GET", path: "/conference-sessions/{conferenceSessionId}/messages", pathParams: ["conferenceSessionId"], queryParams: ["textContains", "dateFrom", "dateTo", "size", "orderAsc"] },
      get_participant_targets: { apiType: "clients", method: "GET", path: "/conference-sessions/{conferenceSessionId}/messages/participant-targets", pathParams: ["conferenceSessionId"] },
      export_txt: { apiType: "clients", method: "GET", path: "/conference-sessions/{conferenceSessionId}/messages/export-txt", pathParams: ["conferenceSessionId"] },
      moderate: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/messages/moderate", pathParams: ["conferenceSessionId"], bodyParam: "moderateData" },
      typing: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/messages/typing", pathParams: ["conferenceSessionId"], bodyParam: "typingData" },
    },
    client,
    {
      send: "Отправить сообщение в чат конференции. / Send a chat message in the conference.",
      edit: "Редактировать сообщение чата. / Edit a chat message.",
      remove: "Удалить сообщения чата. / Remove chat messages.",
      remove_all: "Удалить все сообщения чата. / Remove all chat messages.",
      remove_all_for_participant: "Удалить все сообщения участника. / Remove all messages of a participant.",
      get: "Получить сообщения чата конференции. / Get conference chat messages.",
      get_participant_targets: "Получить целевых участников чата. / Get chat participant targets.",
      export_txt: "Экспортировать чат в TXT. / Export chat to TXT.",
      moderate: "Модерировать сообщение чата. / Moderate a chat message.",
      typing: "Уведомить о наборе текста. / Notify about typing.",
    },
  );
}