import type { IvaApiClient } from "../../api-client.js";
import type { ToolDefinition } from "../../types.js";
import { createActionTool } from "../framework.js";
import { P } from "../params.js";

export function createConferenceInquiryTool(client: IvaApiClient): ToolDefinition {
  return createActionTool(
    "iva_conference_inquiry",
    "IVA conference inquiries (polls): create/find/get/delete/update inquiries, start/stop individual or all inquiries, answer/edit answers, find responders, get aggregated answers, export. Clients API v2.28.12.",
    [
      "create", "find", "get", "delete", "update",
      "start", "stop", "start_all", "stop_all",
      "answer", "edit_answer", "get_answers",
      "find_responders", "get_aggregated_answers",
      "export", "export_all",
    ],
    {
      conferenceSessionId: P.conferenceSessionId,
      inquiryId: P.inquiryId,
      answerId: P.answerId,
      inquiryData: { type: "object", description: "Inquiry creation/update data" },
      answerData: { type: "object", description: "Answer data" },
      answerUpdate: { type: "object", description: "Answer edit data" },
      respondersData: { type: "object", description: "Find responders criteria" },
      limit: P.limit,
      offset: P.offset,
    },
    {
      create: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/inquiries", pathParams: ["conferenceSessionId"], bodyParam: "inquiryData" },
      find: { apiType: "clients", method: "GET", path: "/conference-sessions/{conferenceSessionId}/inquiries", pathParams: ["conferenceSessionId"], queryParams: ["limit", "offset"] },
      get: { apiType: "clients", method: "GET", path: "/conference-sessions/{conferenceSessionId}/inquiries/{inquiryId}", pathParams: ["conferenceSessionId", "inquiryId"] },
      delete: { apiType: "clients", method: "DELETE", path: "/conference-sessions/{conferenceSessionId}/inquiries/{inquiryId}", pathParams: ["conferenceSessionId", "inquiryId"] },
      update: { apiType: "clients", method: "PATCH", path: "/conference-sessions/{conferenceSessionId}/inquiries/{inquiryId}", pathParams: ["conferenceSessionId", "inquiryId"], bodyParam: "inquiryData" },
      start: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/inquiries/{inquiryId}/start", pathParams: ["conferenceSessionId", "inquiryId"], emptyBody: true },
      stop: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/inquiries/{inquiryId}/stop", pathParams: ["conferenceSessionId", "inquiryId"], emptyBody: true },
      start_all: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/start-all-inquiries", pathParams: ["conferenceSessionId"], emptyBody: true },
      stop_all: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/stop-all-inquiries", pathParams: ["conferenceSessionId"], emptyBody: true },
      answer: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/inquiries/{inquiryId}/answers", pathParams: ["conferenceSessionId", "inquiryId"], bodyParam: "answerData" },
      edit_answer: { apiType: "clients", method: "PATCH", path: "/conference-sessions/{conferenceSessionId}/inquiries/{inquiryId}/answers/{answerId}", pathParams: ["conferenceSessionId", "inquiryId", "answerId"], bodyParam: "answerUpdate" },
      get_answers: { apiType: "clients", method: "GET", path: "/conference-sessions/{conferenceSessionId}/inquiries/{inquiryId}/answers", pathParams: ["conferenceSessionId", "inquiryId"], queryParams: ["limit", "offset"] },
      find_responders: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/inquiries/{inquiryId}/find-responders", pathParams: ["conferenceSessionId", "inquiryId"], bodyParam: "respondersData" },
      get_aggregated_answers: { apiType: "clients", method: "GET", path: "/conference-sessions/{conferenceSessionId}/inquiries/{inquiryId}/aggregated-answers", pathParams: ["conferenceSessionId", "inquiryId"] },
      export: { apiType: "clients", method: "GET", path: "/conference-sessions/{conferenceSessionId}/inquiries/{inquiryId}/export", pathParams: ["conferenceSessionId", "inquiryId"] },
      export_all: { apiType: "clients", method: "GET", path: "/conference-sessions/{conferenceSessionId}/export-all-inquiries-answers", pathParams: ["conferenceSessionId"] },
    },
    client,
    {
      create: "Создать опрос в конференции. / Create a poll/inquiry in the conference.",
      find: "Найти опросы конференции. / Find conference inquiries.",
      get: "Получить опрос по ID. / Get inquiry by ID.",
      delete: "Удалить опрос. / Delete an inquiry.",
      update: "Обновить опрос. / Update an inquiry.",
      start: "Запустить опрос. / Start an inquiry.",
      stop: "Остановить опрос. / Stop an inquiry.",
      start_all: "Запустить все опросы. / Start all inquiries.",
      stop_all: "Остановить все опросы. / Stop all inquiries.",
      answer: "Ответить на опрос. / Answer an inquiry.",
      edit_answer: "Редактировать ответ на опрос. / Edit an inquiry answer.",
      get_answers: "Получить ответы на опрос. / Get inquiry answers.",
      find_responders: "Найти респондентов опроса. / Find inquiry responders.",
      get_aggregated_answers: "Получить агрегированные ответы. / Get aggregated answers.",
      export: "Экспортировать ответы на опрос. / Export inquiry answers.",
      export_all: "Экспортировать все ответы на опросы. / Export all inquiry answers.",
    },
  );
}