import type { IvaApiClient } from "../../api-client.js";
import type { ToolDefinition } from "../../types.js";
import { createActionTool } from "../framework.js";
import { P } from "../params.js";
import { API_VERSION } from "../../constants.js";

export function createConferenceLobbyTool(client: IvaApiClient): ToolDefinition {
  return createActionTool(
    "iva_conference_lobby",
    `IVA conference lobby: join/leave lobby, get lobby participants, approve/reject individual or all participant requests. Clients API ${API_VERSION}.`,
    ["join", "leave", "get_participants", "approve", "approve_all", "reject", "reject_all"],
    {
      conferenceSessionId: P.conferenceSessionId,
      profileId: P.profileId,
    },
    {
      join: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/lobby/join", pathParams: ["conferenceSessionId"], emptyBody: true },
      leave: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/lobby/leave", pathParams: ["conferenceSessionId"], emptyBody: true },
      get_participants: { apiType: "clients", method: "GET", path: "/conference-sessions/{conferenceSessionId}/lobby/participants", pathParams: ["conferenceSessionId"] },
      approve: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/lobby/participants/{profileId}/approve", pathParams: ["conferenceSessionId", "profileId"], emptyBody: true },
      approve_all: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/lobby/approve-all", pathParams: ["conferenceSessionId"], emptyBody: true },
      reject: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/lobby/participants/{profileId}/reject", pathParams: ["conferenceSessionId", "profileId"], emptyBody: true },
      reject_all: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/lobby/reject-all", pathParams: ["conferenceSessionId"], emptyBody: true },
    },
    client,
    {
      join: "Войти в лобби конференции. / Join the conference lobby.",
      leave: "Покинуть лобби конференции. / Leave the conference lobby.",
      get_participants: "Получить участников лобби. / Get lobby participants.",
      approve: "Одобрить вход участника в конференцию. / Approve a participant's lobby request.",
      approve_all: "Одобрить все запросы участников. / Approve all lobby requests.",
      reject: "Отклонить вход участника. / Reject a participant's lobby request.",
      reject_all: "Отклонить все запросы участников. / Reject all lobby requests.",
    },
  );
}