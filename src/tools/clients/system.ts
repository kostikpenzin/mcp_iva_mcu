import type { IvaApiClient } from "../../api-client.js";
import type { ToolDefinition } from "../../types.js";
import { createActionTool } from "../framework.js";
import { P } from "../params.js";

export function createSystemTool(client: IvaApiClient): ToolDefinition {
  return createActionTool(
    "iva_system",
    "IVA system info: system info, media info, ICE servers, layouts, broadcast notifications, SMS approval, crash report, mail to support, client applications. Clients API v2.28.12.",
    [
      "get_system_info", "get_media_info", "get_ice_servers",
      "get_layouts", "get_layout", "get_broadcast_notification",
      "confirm_sms", "send_crash_report", "send_mail_to_support",
      "get_client_applications",
    ],
    {
      layoutId: P.layoutId,
      fileId: { type: "string", description: "Crash report file resource UUID" },
      smsData: { type: "object", description: "SMS approval data" },
      mailData: { type: "object", description: "Mail to support data" },
    },
    {
      get_system_info: { apiType: "clients", method: "GET", path: "/public/system/info" },
      get_media_info: { apiType: "clients", method: "GET", path: "/public/system/media-info" },
      get_ice_servers: { apiType: "clients", method: "GET", path: "/system/media/ice-servers" },
      get_layouts: { apiType: "clients", method: "GET", path: "/public/system/layouts" },
      get_layout: { apiType: "clients", method: "GET", path: "/system/layouts/{layoutId}", pathParams: ["layoutId"] },
      get_broadcast_notification: { apiType: "clients", method: "GET", path: "/public/system/broadcast-notification" },
      confirm_sms: { apiType: "clients", method: "POST", path: "/system/sms-approval", bodyParam: "smsData" },
      send_crash_report: { apiType: "clients", method: "POST", path: "/system/crash-report/{fileId}", pathParams: ["fileId"], emptyBody: true },
      send_mail_to_support: { apiType: "clients", method: "POST", path: "/system/mail-to-support", bodyParam: "mailData" },
      get_client_applications: { apiType: "clients", method: "GET", path: "/public/applications" },
    },
    client,
  );
}