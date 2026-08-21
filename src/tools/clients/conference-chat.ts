import type { IvaApiClient } from "../../api-client.js";
import type { ToolDefinition } from "../../types.js";
import { createActionTool } from "../framework.js";
import { P } from "../params.js";

export function createConferenceChatTool(client: IvaApiClient): ToolDefinition {
  return createActionTool(
    "iva_conference_chat",
    "IVA conference chat messages: send/edit/remove/moderate messages, get messages/participant-targets, export to txt, typing notification, remove all messages. Clients API v2.28.12.",
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
    },
    {
      send: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/messages/send", pathParams: ["conferenceSessionId"], bodyParam: "messageData" },
      edit: { apiType: "clients", method: "PATCH", path: "/conference-sessions/{conferenceSessionId}/messages/{messageId}", pathParams: ["conferenceSessionId", "messageId"], bodyParam: "messageEdit" },
      remove: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/messages/remove", pathParams: ["conferenceSessionId"], bodyParam: "removeData" },
      remove_all: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/messages/remove-all", pathParams: ["conferenceSessionId"], emptyBody: true },
      remove_all_for_participant: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/messages/remove-all-for-participant", pathParams: ["conferenceSessionId"], bodyParam: "participantId", bodyWrapper: "participantId" },
      get: { apiType: "clients", method: "GET", path: "/conference-sessions/{conferenceSessionId}/messages", pathParams: ["conferenceSessionId"], queryParams: ["limit", "offset"] },
      get_participant_targets: { apiType: "clients", method: "GET", path: "/conference-sessions/{conferenceSessionId}/messages/participant-targets", pathParams: ["conferenceSessionId"] },
      export_txt: { apiType: "clients", method: "GET", path: "/conference-sessions/{conferenceSessionId}/messages/export-txt", pathParams: ["conferenceSessionId"] },
      moderate: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/messages/moderate", pathParams: ["conferenceSessionId"], bodyParam: "moderateData" },
      typing: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/messages/typing", pathParams: ["conferenceSessionId"], bodyParam: "typingData" },
    },
    client,
  );
}