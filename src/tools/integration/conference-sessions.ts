import type { IvaApiClient } from "../../api-client.js";
import type { ToolDefinition } from "../../types.js";
import { createActionTool } from "../framework.js";
import { P } from "../params.js";

export function createIntegrationConferenceSessionsTool(client: IvaApiClient): ToolDefinition {
  return createActionTool(
    "iva_integration_conference_sessions",
    "IVA Integration API — conference session management: create room, delete/update/find sessions, find documents, get join data, start now, add/remove/find participants. Integration API v1.28.12.",
    [
      "create_room", "delete", "update", "find",
      "find_documents", "get_join_data", "start_now",
      "add_participants", "find_participants", "find_by_profile", "remove_participants",
    ],
    {
      conferenceSessionId: P.conferenceSessionId,
      sessionData: { type: "object", description: "Session creation/update data" },
      roomData: { type: "object", description: "Room creation data" },
      startData: { type: "object", description: "Quick start conference data" },
      participants: P.participants,
      participantIds: P.participantIds,
      profileIds: P.profileIds,
      limit: P.limit,
      offset: P.offset,
      dateFrom: P.dateFrom,
      dateTo: P.dateTo,
    },
    {
      create_room: { apiType: "integration", method: "POST", path: "/conference-sessions/create-room", bodyParam: "roomData" },
      delete: { apiType: "integration", method: "DELETE", path: "/conference-sessions/{conferenceSessionId}", pathParams: ["conferenceSessionId"] },
      update: { apiType: "integration", method: "PATCH", path: "/conference-sessions/{conferenceSessionId}", pathParams: ["conferenceSessionId"], bodyParam: "sessionData" },
      find: { apiType: "integration", method: "GET", path: "/conference-sessions", queryParams: ["dateFrom", "dateTo", "limit", "offset"] },
      find_documents: { apiType: "integration", method: "GET", path: "/conference-sessions/{conferenceSessionId}/documents", pathParams: ["conferenceSessionId"], queryParams: ["limit", "offset"] },
      get_join_data: { apiType: "integration", method: "GET", path: "/conference-sessions/{conferenceSessionId}/join-data", pathParams: ["conferenceSessionId"] },
      start_now: { apiType: "integration", method: "POST", path: "/conference-sessions/start-now", bodyParam: "startData" },
      add_participants: { apiType: "integration", method: "POST", path: "/conference-sessions/{conferenceSessionId}/participants/add", pathParams: ["conferenceSessionId"], bodyParam: "participants" },
      find_participants: { apiType: "integration", method: "GET", path: "/conference-sessions/{conferenceSessionId}/participants", pathParams: ["conferenceSessionId"], queryParams: ["limit", "offset"] },
      find_by_profile: { apiType: "integration", method: "POST", path: "/conference-sessions/{conferenceSessionId}/participants/find-by-profile", pathParams: ["conferenceSessionId"], bodyParam: "profileIds" },
      remove_participants: { apiType: "integration", method: "POST", path: "/conference-sessions/{conferenceSessionId}/participants/remove", pathParams: ["conferenceSessionId"], bodyParam: "participantIds" },
    },
    client,
  );
}