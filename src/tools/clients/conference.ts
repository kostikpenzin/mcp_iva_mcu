import type { IvaApiClient } from "../../api-client.js";
import type { ToolDefinition } from "../../types.js";
import { createActionTool } from "../framework.js";
import { P } from "../params.js";

export function createConferenceTool(client: IvaApiClient): ToolDefinition {
  return createActionTool(
    "iva_conference",
    "IVA conference management: create/get/update/delete conferences, calculate session schedule, quick start, create rooms, get participants, respond to invitations, get free resources. Clients API v2.28.12.",
    [
      "create", "get", "delete", "update", "calculate_sessions_schedule",
      "get_draft", "get_free_resources", "get_participant", "get_participants",
      "respond_on_invitation", "start_now", "create_room",
    ],
    {
      conferenceId: P.conferenceId,
      participantId: P.participantId,
      conferenceData: { type: "object", description: "Conference creation/update data" },
      scheduleData: { type: "object", description: "Schedule calculation data" },
      invitationResponse: { type: "object", description: "Invitation response data" },
      startNowData: { type: "object", description: "Quick start conference data" },
      roomData: { type: "object", description: "Room creation data" },
      limit: P.limit,
      offset: P.offset,
    },
    {
      create: { apiType: "clients", method: "POST", path: "/conferences", bodyParam: "conferenceData" },
      get: { apiType: "clients", method: "GET", path: "/conferences/{conferenceId}", pathParams: ["conferenceId"] },
      delete: { apiType: "clients", method: "DELETE", path: "/conferences/{conferenceId}", pathParams: ["conferenceId"] },
      update: { apiType: "clients", method: "PATCH", path: "/conferences/{conferenceId}", pathParams: ["conferenceId"], bodyParam: "conferenceData" },
      calculate_sessions_schedule: { apiType: "clients", method: "POST", path: "/conferences/calculate-sessions-schedule", bodyParam: "scheduleData" },
      get_draft: { apiType: "clients", method: "GET", path: "/conferences/{conferenceId}/draft-based-on", pathParams: ["conferenceId"] },
      get_free_resources: { apiType: "clients", method: "GET", path: "/conferences/{conferenceId}/subscriptions/free-resources", pathParams: ["conferenceId"] },
      get_participant: { apiType: "clients", method: "GET", path: "/conferences/{conferenceId}/participants/{participantId}", pathParams: ["conferenceId", "participantId"] },
      get_participants: { apiType: "clients", method: "GET", path: "/conferences/{conferenceId}/participants", pathParams: ["conferenceId"], queryParams: ["limit", "offset"] },
      respond_on_invitation: { apiType: "clients", method: "POST", path: "/conferences/{conferenceId}/respond-on-invitation", pathParams: ["conferenceId"], bodyParam: "invitationResponse" },
      start_now: { apiType: "clients", method: "POST", path: "/conferences/start-now", bodyParam: "startNowData" },
      create_room: { apiType: "clients", method: "POST", path: "/rooms", bodyParam: "roomData" },
    },
    client,
  );
}