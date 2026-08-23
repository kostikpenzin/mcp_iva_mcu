import type { IvaApiClient } from "../../api-client.js";
import type { ToolDefinition } from "../../types.js";
import { createActionTool } from "../framework.js";
import { P } from "../params.js";
import { API_VERSION } from "../../constants.js";

export function createConferenceQuestionnaireTool(client: IvaApiClient): ToolDefinition {
  return createActionTool(
    "iva_conference_questionnaire",
    `IVA conference questionnaire: get questionnaire, save questionnaire answers. Clients API ${API_VERSION}.`,
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
    {
      get: "Get the questionnaire for a conference session (questions/structure). Получить опрос конференции.",
      save_answers: "Save the participant's answers to the conference questionnaire. Сохранить ответы на опрос.",
    },
  );
}