import type { IvaApiClient } from "../../api-client.js";
import type { ToolDefinition } from "../../types.js";
import { createActionTool } from "../framework.js";
import { P } from "../params.js";

export function createConferenceSessionGroupsTool(client: IvaApiClient): ToolDefinition {
  return createActionTool(
    "iva_conference_session_groups",
    "IVA conference session groups: create/activate/deactivate/remove groups, extend duration, move participants, get groups. Clients API v2.28.12.",
    ["activate", "create", "deactivate", "extend_duration", "get", "move_participants", "remove"],
    {
      conferenceSessionId: P.conferenceSessionId,
      groupsData: { type: "object", description: "Group creation data" },
      activateData: { type: "object", description: "Group activation data (groupIds)" },
      deactivateData: { type: "object", description: "Group deactivation data (groupIds)" },
      extendData: { type: "object", description: "Extend duration data" },
      moveData: { type: "object", description: "Move participants data" },
      removeData: { type: "object", description: "Remove groups data (groupIds)" },
    },
    {
      activate: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/groups/activate", pathParams: ["conferenceSessionId"], bodyParam: "activateData" },
      create: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/groups/create", pathParams: ["conferenceSessionId"], bodyParam: "groupsData" },
      deactivate: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/groups/deactivate", pathParams: ["conferenceSessionId"], bodyParam: "deactivateData" },
      extend_duration: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/groups/extend-duration", pathParams: ["conferenceSessionId"], bodyParam: "extendData" },
      get: { apiType: "clients", method: "GET", path: "/conference-sessions/{conferenceSessionId}/groups", pathParams: ["conferenceSessionId"] },
      move_participants: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/groups/move", pathParams: ["conferenceSessionId"], bodyParam: "moveData" },
      remove: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/groups/remove", pathParams: ["conferenceSessionId"], bodyParam: "removeData" },
    },
    client,
  );
}