import type { IvaApiClient } from "../../api-client.js";
import type { ToolDefinition } from "../../types.js";
import { createActionTool } from "../framework.js";
import { P } from "../params.js";

export function createDocumentsTool(client: IvaApiClient): ToolDefinition {
  return createActionTool(
    "iva_documents",
    "IVA user documents: convert document, delete single/multiple, list converted pages. Clients API v2.28.12.",
    ["convert", "delete", "delete_multiple", "get_pages"],
    {
      documentId: P.documentId,
      documentIds: P.documentIds,
      limit: P.limit,
      offset: P.offset,
    },
    {
      convert: { apiType: "clients", method: "POST", path: "/documents/{documentId}/convert", pathParams: ["documentId"], emptyBody: true },
      delete: { apiType: "clients", method: "DELETE", path: "/documents/{documentId}", pathParams: ["documentId"] },
      delete_multiple: { apiType: "clients", method: "POST", path: "/documents", bodyParam: "documentIds", bodyWrapper: "documentIds" },
      get_pages: { apiType: "clients", method: "GET", path: "/documents/{documentId}/pages", pathParams: ["documentId"], queryParams: ["limit", "offset"] },
    },
    client,
  );
}