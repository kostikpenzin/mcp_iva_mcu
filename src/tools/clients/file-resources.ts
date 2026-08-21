import type { IvaApiClient } from "../../api-client.js";
import type { ToolDefinition } from "../../types.js";
import { createActionTool } from "../framework.js";
import { P } from "../params.js";

export function createFileResourcesTool(client: IvaApiClient): ToolDefinition {
  return createActionTool(
    "iva_file_resources",
    "IVA file resources: create resource, download/upload files, get resources info, subscribe to scanning status. Clients API v2.28.12.",
    ["create", "download", "upload", "get_info", "subscribe_scanning"],
    {
      resourceId: P.resourceId,
      resourceIds: P.resourceIds,
      resourcesInfo: { type: "object", description: "Resources info request data" },
      scanData: { type: "object", description: "Scanning status subscription data" },
    },
    {
      create: { apiType: "clients", method: "POST", path: "/resources/create", emptyBody: true },
      download: { apiType: "clients", method: "GET", path: "/resources/{resourceId}", pathParams: ["resourceId"] },
      upload: { apiType: "clients", method: "POST", path: "/resources/{resourceId}", pathParams: ["resourceId"], rawBody: true },
      get_info: { apiType: "clients", method: "POST", path: "/resources/info", bodyParam: "resourceIds", bodyWrapper: "resourceIds" },
      subscribe_scanning: { apiType: "clients", method: "POST", path: "/resources/status/subscribe", bodyParam: "scanData" },
    },
    client,
  );
}