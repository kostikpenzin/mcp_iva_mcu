import type { IvaApiClient } from "../../api-client.js";
import type { ToolDefinition } from "../../types.js";
import { createActionTool } from "../framework.js";
import { P } from "../params.js";

export function createIntegrationResourcesTool(client: IvaApiClient): ToolDefinition {
  return createActionTool(
    "iva_integration_resources",
    "IVA Integration API — resources: download file by resource ID. Integration API v1.28.12.",
    ["download"],
    { resourceId: P.resourceId },
    { download: { apiType: "integration", method: "GET", path: "/resources/{resourceId}", pathParams: ["resourceId"] } },
    client,
  );
}