import type { IvaApiClient } from "../../api-client.js";
import type { ToolDefinition } from "../../types.js";
import { createActionTool } from "../framework.js";
import { P } from "../params.js";
import { API_VERSION } from "../../constants.js";

export function createSystemTool(client: IvaApiClient): ToolDefinition {
  return createActionTool(
    "iva_system",
    `IVA system info: system info, media info, ICE servers, layouts, broadcast notifications, SMS approval, crash report, mail to support, client applications. Clients API ${API_VERSION}.`,
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
    {
      get_system_info: "Get IVA system information (build version, server info, etc.).",
      get_media_info: "Get IVA media server information (media capabilities, codecs, etc.).",
      get_ice_servers: "Get ICE/TURN servers configuration for WebRTC connections.",
      get_layouts: "Get the list of available conference video layouts.",
      get_layout: "Get a specific conference layout by ID (composition/grid definition).",
      get_broadcast_notification: "Get the current global broadcast notification (system-wide message).",
      confirm_sms: "Confirm an SMS approval request (e.g. verify SMS code for phone registration).",
      send_crash_report: "Send a crash report (with file resource) to IVA support.",
      send_mail_to_support: "Send an email message to IVA technical support.",
      get_client_applications: "Get the list of available IVA client applications (download links, versions).",
    },
  );
}