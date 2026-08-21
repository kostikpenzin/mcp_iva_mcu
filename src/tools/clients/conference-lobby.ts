import type { IvaApiClient } from "../../api-client.js";
import type { ToolDefinition } from "../../types.js";
import { createActionTool } from "../framework.js";
import { P } from "../params.js";

export function createConferenceLobbyTool(client: IvaApiClient): ToolDefinition {
  return createActionTool(
    "iva_conference_lobby",
    "IVA conference lobby: join/leave lobby, get lobby participants, approve/reject individual or all participant requests. Clients API v2.28.12.",
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
  );
}