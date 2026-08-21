import type { IvaApiClient } from "../../api-client.js";
import type { ToolDefinition } from "../../types.js";
import { createActionTool } from "../framework.js";
import { P } from "../params.js";

export function createIntegrationConferencesTool(client: IvaApiClient): ToolDefinition {
  return createActionTool(
    "iva_integration_conferences",
    "IVA Integration API — conference management: create/delete/update conferences, add/remove/find participants, list templates. Integration API v1.28.12.",
    ["create", "delete", "update", "add_participants", "find_participants", "remove_participants", "get_templates"],
    {
      conferenceId: P.conferenceId,
      conferenceData: { type: "object", description: "Conference creation/update data" },
      participants: P.participants,
      participantIds: P.participantIds,
      limit: P.limit,
      offset: P.offset,
    },
    {
      create: { apiType: "integration", method: "POST", path: "/conferences", bodyParam: "conferenceData" },
      delete: { apiType: "integration", method: "DELETE", path: "/conferences/{conferenceId}", pathParams: ["conferenceId"] },
      update: { apiType: "integration", method: "PATCH", path: "/conferences/{conferenceId}", pathParams: ["conferenceId"], bodyParam: "conferenceData" },
      add_participants: { apiType: "integration", method: "POST", path: "/conferences/{conferenceId}/participants/add", pathParams: ["conferenceId"], bodyParam: "participants", bodyWrapper: "participants" },
      find_participants: { apiType: "integration", method: "GET", path: "/conferences/{conferenceId}/participants", pathParams: ["conferenceId"], queryParams: ["limit", "offset"] },
      remove_participants: { apiType: "integration", method: "POST", path: "/conferences/{conferenceId}/participants/remove", pathParams: ["conferenceId"], bodyParam: "participantIds", bodyWrapper: "participantIds" },
      get_templates: { apiType: "integration", method: "GET", path: "/conference-templates" },
    },
    client,
  );
}