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
      add_participants: { apiType: "integration", method: "POST", path: "/conferences/{conferenceId}/participants/add", pathParams: ["conferenceId"], bodyParam: "participants", bodyWrapper: "data" },
      find_participants: { apiType: "integration", method: "GET", path: "/conferences/{conferenceId}/participants", pathParams: ["conferenceId"], queryParams: ["limit", "offset"] },
      remove_participants: { apiType: "integration", method: "POST", path: "/conferences/{conferenceId}/participants/remove", pathParams: ["conferenceId"], bodyParam: "participantIds", bodyWrapper: "data" },
      get_templates: { apiType: "integration", method: "GET", path: "/conference-templates" },
    },
    client,
    {
      create: "Создать новую конференцию / Create a new conference.",
      delete: "Удалить конференцию / Delete a conference.",
      update: "Обновить данные конференции / Update an existing conference.",
      add_participants: "Добавить участников в конференцию / Add participants to a conference.",
      find_participants: "Найти участников конференции / Find conference participants.",
      remove_participants: "Удалить участников из конференции / Remove participants from a conference.",
      get_templates: "Получить шаблоны конференций / Get list of conference templates.",
    },
  );
}