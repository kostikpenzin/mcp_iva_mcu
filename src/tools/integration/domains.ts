import type { IvaApiClient } from "../../api-client.js";
import type { ToolDefinition } from "../../types.js";
import { createActionTool } from "../framework.js";
import { P } from "../params.js";

export function createIntegrationDomainsTool(client: IvaApiClient): ToolDefinition {
  return createActionTool(
    "iva_integration_domains",
    "IVA Integration API — domains: get domain info or all domains. Integration API v1.28.12.",
    ["get", "get_all"],
    { domainId: P.domainId },
    {
      get: { apiType: "integration", method: "GET", path: "/domains/{domainId}", pathParams: ["domainId"] },
      get_all: { apiType: "integration", method: "GET", path: "/domains" },
    },
    client,
  );
}