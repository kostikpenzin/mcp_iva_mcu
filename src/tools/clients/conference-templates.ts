import type { IvaApiClient } from "../../api-client.js";
import type { ToolDefinition } from "../../types.js";
import { createActionTool } from "../framework.js";
import { P } from "../params.js";
import { API_VERSION } from "../../constants.js";

export function createConferenceTemplatesTool(client: IvaApiClient): ToolDefinition {
  return createActionTool(
    "iva_conference_templates",
    `IVA conference templates: list/create/get/delete/update templates, set template as default. Clients API ${API_VERSION}.`,
    ["list", "create", "get", "delete", "update", "set_as_default"],
    {
      conferenceTemplateId: P.conferenceTemplateId,
      templateData: { type: "object", description: "Conference template creation/update data" },
    },
    {
      list: { apiType: "clients", method: "GET", path: "/conference-templates" },
      create: { apiType: "clients", method: "POST", path: "/conference-templates", bodyParam: "templateData" },
      get: { apiType: "clients", method: "GET", path: "/conference-templates/{conferenceTemplateId}", pathParams: ["conferenceTemplateId"] },
      delete: { apiType: "clients", method: "DELETE", path: "/conference-templates/{conferenceTemplateId}", pathParams: ["conferenceTemplateId"] },
      update: { apiType: "clients", method: "PATCH", path: "/conference-templates/{conferenceTemplateId}", pathParams: ["conferenceTemplateId"], bodyParam: "templateData" },
      set_as_default: { apiType: "clients", method: "POST", path: "/conference-templates/{conferenceTemplateId}/set-as-default", pathParams: ["conferenceTemplateId"], emptyBody: true },
    },
    client,
    {
      list: "Получить список шаблонов конференций. / List conference templates.",
      create: "Создать шаблон конференции. / Create a conference template.",
      get: "Получить шаблон конференции по ID. / Get conference template by ID.",
      delete: "Удалить шаблон конференции. / Delete a conference template.",
      update: "Обновить шаблон конференции. / Update a conference template.",
      set_as_default: "Сделать шаблон конференции шаблоном по умолчанию. / Set template as default.",
    },
  );
}