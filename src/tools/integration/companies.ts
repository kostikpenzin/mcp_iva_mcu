import type { IvaApiClient } from "../../api-client.js";
import type { ToolDefinition } from "../../types.js";
import { createActionTool } from "../framework.js";
import { P } from "../params.js";

export function createIntegrationCompaniesTool(client: IvaApiClient): ToolDefinition {
  return createActionTool(
    "iva_integration_companies",
    "IVA Integration API — company management: find/create/get/update companies, block/unblock, disk utilization, paid calls balance management. Integration API v1.28.12.",
    [
      "find", "create", "get", "update",
      "block", "unblock",
      "get_disk_utilization",
      "get_paid_calls_balance", "delete_paid_calls_balance",
      "edit_paid_calls_balance", "get_paid_calls_balance_history",
    ],
    {
      companyId: P.companyId,
      companyData: { type: "object", description: "Company creation/update data" },
      balanceData: { type: "object", description: "Paid calls balance data" },
      limit: P.limit,
      offset: P.offset,
    },
    {
      find: { apiType: "integration", method: "GET", path: "/companies", queryParams: ["limit", "offset"] },
      create: { apiType: "integration", method: "POST", path: "/companies", bodyParam: "companyData" },
      get: { apiType: "integration", method: "GET", path: "/companies/{companyId}", pathParams: ["companyId"] },
      update: { apiType: "integration", method: "PATCH", path: "/companies/{companyId}", pathParams: ["companyId"], bodyParam: "companyData" },
      block: { apiType: "integration", method: "POST", path: "/companies/{companyId}/block", pathParams: ["companyId"], emptyBody: true },
      unblock: { apiType: "integration", method: "POST", path: "/companies/{companyId}/unblock", pathParams: ["companyId"], emptyBody: true },
      get_disk_utilization: { apiType: "integration", method: "GET", path: "/companies/{companyId}/disk-utilization", pathParams: ["companyId"] },
      get_paid_calls_balance: { apiType: "integration", method: "GET", path: "/companies/{companyId}/paid-calls-balance", pathParams: ["companyId"] },
      delete_paid_calls_balance: { apiType: "integration", method: "DELETE", path: "/companies/{companyId}/paid-calls-balance", pathParams: ["companyId"] },
      edit_paid_calls_balance: { apiType: "integration", method: "PATCH", path: "/companies/{companyId}/paid-calls-balance", pathParams: ["companyId"], bodyParam: "balanceData" },
      get_paid_calls_balance_history: { apiType: "integration", method: "GET", path: "/companies/{companyId}/paid-calls-balance/history", pathParams: ["companyId"], queryParams: ["limit", "offset"] },
    },
    client,
    {
      find: "Найти компании / Find companies with pagination.",
      create: "Создать новую компанию / Create a new company.",
      get: "Получить информацию о компании / Get company information by companyId.",
      update: "Обновить данные компании / Update an existing company's information.",
      block: "Заблокировать компанию / Block a company.",
      unblock: "Разблокировать компанию / Unblock a previously blocked company.",
      get_disk_utilization: "Получить информацию об использовании диска компании / Get company's disk utilization.",
      get_paid_calls_balance: "Получить баланс платных звонков компании / Get company's paid calls balance.",
      delete_paid_calls_balance: "Удалить баланс платных звонков компании / Delete the company's paid calls balance.",
      edit_paid_calls_balance: "Изменить баланс платных звонков компании / Edit company's paid calls balance.",
      get_paid_calls_balance_history: "Получить историю баланса платных звонков компании / Get company's paid calls balance history.",
    },
  );
}