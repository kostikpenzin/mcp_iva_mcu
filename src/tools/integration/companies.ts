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
  );
}