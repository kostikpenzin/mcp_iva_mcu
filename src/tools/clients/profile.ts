import type { IvaApiClient } from "../../api-client.js";
import type { ToolDefinition } from "../../types.js";
import { createActionTool } from "../framework.js";
import { P } from "../params.js";

export function createProfileTool(client: IvaApiClient): ToolDefinition {
  return createActionTool(
    "iva_profile",
    "IVA user profile management: get/update profile, call forwarding rules, password management, disk utilization, notifications, subscriptions. Clients API v2.28.12.",
    [
      "get", "update", "get_call_forwarding", "create_call_forwarding",
      "delete_call_forwarding", "update_call_forwarding",
      "update_password", "update_password_by_credentials",
      "get_disk_utilization", "get_notifications_summary",
      "get_password_requirements", "get_password_recovery_info",
      "request_password_recovery", "update_password_by_recovery",
      "validate_password", "get_private_office_url",
      "get_subscriptions", "get_free_resources", "get_user_files",
    ],
    {
      profileId: P.profileId,
      forwardingId: P.forwardingId,
      subscriptionId: P.subscriptionId,
      recoveryTokenId: P.recoveryTokenId,
      profileUpdate: { type: "object", description: "Profile fields to update" },
      forwardingRule: { type: "object", description: "Call forwarding rule data" },
      forwardingUpdate: { type: "object", description: "Call forwarding rule update" },
      passwordData: { type: "object", description: "Password change data {oldPassword, newPassword} or {newPassword}" },
      credentials: { type: "object", description: "Credentials {login, password}" },
      recoveryData: { type: "object", description: "Password recovery data" },
      recoveryRequest: { type: "object", description: "Recovery request {email}" },
      passwordToValidate: { type: "string", description: "Password string to validate" },
    },
    {
      get: { apiType: "clients", method: "GET", path: "/profiles/{profileId}", pathParams: ["profileId"] },
      update: { apiType: "clients", method: "PATCH", path: "/profiles/{profileId}", pathParams: ["profileId"], bodyParam: "profileUpdate" },
      get_call_forwarding: { apiType: "clients", method: "GET", path: "/profiles/{profileId}/call-forwarding", pathParams: ["profileId"] },
      create_call_forwarding: { apiType: "clients", method: "POST", path: "/profiles/{profileId}/call-forwarding", pathParams: ["profileId"], bodyParam: "forwardingRule" },
      delete_call_forwarding: { apiType: "clients", method: "DELETE", path: "/profiles/{profileId}/call-forwarding/{forwardingId}", pathParams: ["profileId", "forwardingId"] },
      update_call_forwarding: { apiType: "clients", method: "PATCH", path: "/profiles/{profileId}/call-forwarding/{forwardingId}", pathParams: ["profileId", "forwardingId"], bodyParam: "forwardingUpdate" },
      update_password: { apiType: "clients", method: "POST", path: "/profiles/{profileId}/change-password", pathParams: ["profileId"], bodyParam: "passwordData" },
      update_password_by_credentials: { apiType: "clients", method: "POST", path: "/public/profiles/change-password", bodyParam: "credentials" },
      get_disk_utilization: { apiType: "clients", method: "GET", path: "/profiles/{profileId}/disk-utilization", pathParams: ["profileId"] },
      get_notifications_summary: { apiType: "clients", method: "GET", path: "/profiles/{profileId}/notifications/summary", pathParams: ["profileId"] },
      get_password_requirements: { apiType: "clients", method: "GET", path: "/public/profiles/password-requirements" },
      get_password_recovery_info: { apiType: "clients", method: "GET", path: "/public/profiles/password-recovery/{recoveryTokenId}", pathParams: ["recoveryTokenId"] },
      request_password_recovery: { apiType: "clients", method: "POST", path: "/public/profiles/password-recovery/request-recovery", bodyParam: "recoveryRequest" },
      update_password_by_recovery: { apiType: "clients", method: "POST", path: "/public/profiles/password-recovery/{recoveryTokenId}/change-password", pathParams: ["recoveryTokenId"], bodyParam: "passwordData" },
      validate_password: { apiType: "clients", method: "POST", path: "/public/profiles/validate-password", bodyParam: "passwordToValidate", bodyWrapper: "password" },
      get_private_office_url: { apiType: "clients", method: "GET", path: "/profiles/{profileId}/private-office-url", pathParams: ["profileId"] },
      get_subscriptions: { apiType: "clients", method: "POST", path: "/profiles/{profileId}/subscriptions", pathParams: ["profileId"], emptyBody: true },
      get_free_resources: { apiType: "clients", method: "GET", path: "/profiles/{profileId}/subscriptions/{subscriptionId}/free-resources", pathParams: ["profileId", "subscriptionId"] },
      get_user_files: { apiType: "clients", method: "GET", path: "/disk", queryParams: ["limit", "offset"] },
    },
    client,
  );
}