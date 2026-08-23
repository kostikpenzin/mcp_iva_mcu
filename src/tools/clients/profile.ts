import type { IvaApiClient } from "../../api-client.js";
import type { ToolDefinition } from "../../types.js";
import { createActionTool } from "../framework.js";
import { P } from "../params.js";
import { API_VERSION } from "../../constants.js";

export function createProfileTool(client: IvaApiClient): ToolDefinition {
  return createActionTool(
    "iva_profile",
    `IVA user profile management: get/update profile, call forwarding rules, disk utilization, notifications, subscriptions. Clients API ${API_VERSION}. Note: password management and recovery actions are excluded for security.`,
    [
      "get", "update", "get_call_forwarding", "create_call_forwarding",
      "delete_call_forwarding", "update_call_forwarding",
      "get_disk_utilization", "get_notifications_summary",
      "get_password_requirements",
      "get_private_office_url",
      "get_subscriptions", "get_free_resources", "get_user_files",
    ],
    {
      profileId: P.profileId,
      forwardingId: P.forwardingId,
      subscriptionId: P.subscriptionId,
      profileUpdate: { type: "object", description: "Profile fields to update" },
      forwardingRule: { type: "object", description: "Call forwarding rule data" },
      forwardingUpdate: { type: "object", description: "Call forwarding rule update" },
    },
    {
      get: { apiType: "clients", method: "GET", path: "/profiles/{profileId}", pathParams: ["profileId"] },
      update: { apiType: "clients", method: "PATCH", path: "/profiles/{profileId}", pathParams: ["profileId"], bodyParam: "profileUpdate" },
      get_call_forwarding: { apiType: "clients", method: "GET", path: "/profiles/{profileId}/call-forwarding", pathParams: ["profileId"] },
      create_call_forwarding: { apiType: "clients", method: "POST", path: "/profiles/{profileId}/call-forwarding", pathParams: ["profileId"], bodyParam: "forwardingRule" },
      delete_call_forwarding: { apiType: "clients", method: "DELETE", path: "/profiles/{profileId}/call-forwarding/{forwardingId}", pathParams: ["profileId", "forwardingId"] },
      update_call_forwarding: { apiType: "clients", method: "PATCH", path: "/profiles/{profileId}/call-forwarding/{forwardingId}", pathParams: ["profileId", "forwardingId"], bodyParam: "forwardingUpdate" },
      get_disk_utilization: { apiType: "clients", method: "GET", path: "/profiles/{profileId}/disk-utilization", pathParams: ["profileId"] },
      get_notifications_summary: { apiType: "clients", method: "GET", path: "/profiles/{profileId}/notifications/summary", pathParams: ["profileId"] },
      get_password_requirements: { apiType: "clients", method: "GET", path: "/public/profiles/password-requirements" },
      get_private_office_url: { apiType: "clients", method: "GET", path: "/profiles/{profileId}/private-office-url", pathParams: ["profileId"] },
      get_subscriptions: { apiType: "clients", method: "POST", path: "/profiles/{profileId}/subscriptions", pathParams: ["profileId"], emptyBody: true },
      get_free_resources: { apiType: "clients", method: "GET", path: "/profiles/{profileId}/subscriptions/{subscriptionId}/free-resources", pathParams: ["profileId", "subscriptionId"] },
      get_user_files: { apiType: "clients", method: "GET", path: "/disk", queryParams: ["limit", "offset"] },
    },
    client,
    {
      get: "Get user profile by ID. Use when user says 'покажи профиль', 'get my profile'.",
      update: "Update profile fields. Обнови профиль, update profile.",
      get_call_forwarding: "Get call forwarding rules. Получить правила переадресации.",
      create_call_forwarding: "Create a call forwarding rule. Создать правило переадресации.",
      delete_call_forwarding: "Delete a call forwarding rule. Удалить правило переадресации.",
      update_call_forwarding: "Update a call forwarding rule. Обновить правило переадресации.",
      get_disk_utilization: "Get disk space usage. Сколько места на диске, disk usage.",
      get_notifications_summary: "Get notifications summary. Сводка уведомлений.",
      get_password_requirements: "Get password requirements/rules (read-only, no sensitive data). Требования к паролю.",
      get_private_office_url: "Get private office URL. URL личного кабинета.",
      get_subscriptions: "Get user subscriptions. Получить подписки.",
      get_free_resources: "Get free resources for a subscription. Свободные ресурсы.",
      get_user_files: "Get user files from disk. Мои файлы, my files.",
    },
  );
}