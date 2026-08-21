import type { IvaApiClient } from "../../api-client.js";
import type { ToolDefinition } from "../../types.js";
import { createActionTool } from "../framework.js";
import { P } from "../params.js";

export function createIntegrationSubscriptionsTool(client: IvaApiClient): ToolDefinition {
  return createActionTool(
    "iva_integration_subscriptions",
    "IVA Integration API — subscriptions: get all/create/get/delete/update subscriptions. Integration API v1.28.12.",
    ["get_all", "create", "get", "delete", "update"],
    {
      subscriptionId: P.subscriptionId,
      subscriptionData: { type: "object", description: "Subscription creation/update data" },
    },
    {
      get_all: { apiType: "integration", method: "GET", path: "/subscriptions" },
      create: { apiType: "integration", method: "POST", path: "/subscriptions", bodyParam: "subscriptionData" },
      get: { apiType: "integration", method: "GET", path: "/subscriptions/{subscriptionId}", pathParams: ["subscriptionId"] },
      delete: { apiType: "integration", method: "DELETE", path: "/subscriptions/{subscriptionId}", pathParams: ["subscriptionId"] },
      update: { apiType: "integration", method: "PATCH", path: "/subscriptions/{subscriptionId}", pathParams: ["subscriptionId"], bodyParam: "subscriptionData" },
    },
    client,
    {
      get_all: "Получить список всех подписок / Get all subscriptions.",
      create: "Создать новую подписку / Create a new subscription (webhook).",
      get: "Получить информацию о подписке / Get subscription information by subscriptionId.",
      delete: "Удалить подписку / Delete a subscription.",
      update: "Обновить данные подписки / Update an existing subscription.",
    },
  );
}