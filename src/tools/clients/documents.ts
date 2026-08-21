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
    {
      convert: "Convert a document to whiteboard pages (PDF/PPTX -> slides). Конвертировать документ в страницы доски.",
      delete: "Delete a single document. Удалить документ.",
      delete_multiple: "Delete multiple documents at once. Удалить несколько документов.",
      get_pages: "Get the list of converted pages for a document (with pagination).",
    },
  );
}