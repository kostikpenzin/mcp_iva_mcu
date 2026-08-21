import type { IvaApiClient } from "../../api-client.js";
import type { ToolDefinition } from "../../types.js";
import { createActionTool } from "../framework.js";
import { P } from "../params.js";

export function createIntegrationDocumentsTool(client: IvaApiClient): ToolDefinition {
  return createActionTool(
    "iva_integration_documents",
    "IVA Integration API — documents: get disk files, delete single or multiple documents. Integration API v1.28.12.",
    ["get_disk_files", "delete", "delete_multiple"],
    {
      documentId: P.documentId,
      documentIds: P.documentIds,
      limit: P.limit,
      offset: P.offset,
    },
    {
      get_disk_files: { apiType: "integration", method: "GET", path: "/disk", queryParams: ["limit", "offset"] },
      delete: { apiType: "integration", method: "DELETE", path: "/documents/{documentId}", pathParams: ["documentId"] },
      delete_multiple: { apiType: "integration", method: "POST", path: "/documents/remove", bodyParam: "documentIds" },
    },
    client,
  );
}