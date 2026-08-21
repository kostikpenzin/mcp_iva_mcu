import type { IvaApiClient } from "../../api-client.js";
import type { ToolDefinition } from "../../types.js";
import { createActionTool } from "../framework.js";
import { P } from "../params.js";

export function createConferenceQuestionnaireTool(client: IvaApiClient): ToolDefinition {
  return createActionTool(
    "iva_conference_questionnaire",
    "IVA conference questionnaire: get questionnaire, save questionnaire answers. Clients API v2.28.12.",
    ["get", "save_answers"],
    {
      conferenceSessionId: P.conferenceSessionId,
      answersData: { type: "object", description: "Questionnaire answers data" },
    },
    {
      get: { apiType: "clients", method: "GET", path: "/public/conference-sessions/{conferenceSessionId}/questionnaire", pathParams: ["conferenceSessionId"] },
      save_answers: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/questionnaire/save-answers", pathParams: ["conferenceSessionId"], bodyParam: "answersData" },
    },
    client,
  );
}