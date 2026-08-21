import type { IvaApiClient } from "../../api-client.js";
import type { ToolDefinition } from "../../types.js";
import { createActionTool } from "../framework.js";
import { P } from "../params.js";

export function createIntegrationUsersTool(client: IvaApiClient): ToolDefinition {
  return createActionTool(
    "iva_integration_users",
    "IVA Integration API — user management: find/create/get/update/delete users, block/unblock, paid calls balance management, login. Integration API v1.28.12.",
    [
      "find", "create", "get", "update", "delete",
      "block", "unblock", "login",
      "get_paid_calls_balance", "delete_paid_calls_balance",
      "edit_paid_calls_balance", "get_paid_calls_balance_history",
    ],
    {
      profileId: P.profileId,
      userData: { type: "object", description: "User creation/update data" },
      loginData: { type: "object", description: "Login credentials" },
      balanceData: { type: "object", description: "Paid calls balance data" },
      limit: P.limit,
      offset: P.offset,
      sortBy: P.sortBy,
      sortDirection: P.sortDirection,
    },
    {
      find: { apiType: "integration", method: "GET", path: "/users", queryParams: ["limit", "offset", "sortBy", "sortDirection"] },
      create: { apiType: "integration", method: "POST", path: "/users", bodyParam: "userData" },
      get: { apiType: "integration", method: "GET", path: "/users/{profileId}", pathParams: ["profileId"] },
      update: { apiType: "integration", method: "PATCH", path: "/users/{profileId}", pathParams: ["profileId"], bodyParam: "userData" },
      delete: { apiType: "integration", method: "DELETE", path: "/users/{profileId}", pathParams: ["profileId"] },
      block: { apiType: "integration", method: "POST", path: "/users/{profileId}/block", pathParams: ["profileId"], emptyBody: true },
      unblock: { apiType: "integration", method: "POST", path: "/users/{profileId}/unblock", pathParams: ["profileId"], emptyBody: true },
      login: { apiType: "integration", method: "POST", path: "/users/login", bodyParam: "loginData" },
      get_paid_calls_balance: { apiType: "integration", method: "GET", path: "/users/{profileId}/paid-calls-balance", pathParams: ["profileId"] },
      delete_paid_calls_balance: { apiType: "integration", method: "DELETE", path: "/users/{profileId}/paid-calls-balance", pathParams: ["profileId"] },
      edit_paid_calls_balance: { apiType: "integration", method: "PATCH", path: "/users/{profileId}/paid-calls-balance", pathParams: ["profileId"], bodyParam: "balanceData" },
      get_paid_calls_balance_history: { apiType: "integration", method: "GET", path: "/users/{profileId}/paid-calls-balance/history", pathParams: ["profileId"], queryParams: ["limit", "offset"] },
    },
    client,
    {
      find: "Найти пользователей по фильтрам / Find users with filtering and pagination.",
      create: "Создать нового пользователя / Create a new user account.",
      get: "Получить информацию о пользователе / Get user information by profileId.",
      update: "Обновить данные пользователя / Update an existing user's information.",
      delete: "Удалить пользователя / Delete a user account.",
      block: "Заблокировать пользователя / Block a user account.",
      unblock: "Разблокировать пользователя / Unblock a previously blocked user.",
      login: "Войти как пользователь / Log in as a user (returns auth token).",
      get_paid_calls_balance: "Получить баланс платных звонков пользователя / Get user's paid calls balance.",
      delete_paid_calls_balance: "Удалить баланс платных звонков / Delete the paid calls balance.",
      edit_paid_calls_balance: "Изменить баланс платных звонков / Edit user's paid calls balance.",
      get_paid_calls_balance_history: "Получить историю баланса платных звонков / Get paid calls balance history.",
    },
  );
}