import type { IvaApiClient } from "../../api-client.js";
import type { ToolDefinition } from "../../types.js";
import { createActionTool } from "../framework.js";
import { P } from "../params.js";

export function createWhiteboardTool(client: IvaApiClient): ToolDefinition {
  return createActionTool(
    "iva_whiteboard",
    "IVA whiteboard: start/stop demonstration, manage books and pages (add/delete/update/clear/copy/reorder), get whiteboard/books/pages, export to PNG, undo, save change, update cursor/demo state. Clients API v2.28.12.",
    [
      "load", "start_demo", "stop_demo", "update_cursor", "update_demo_state",
      "get_books", "add_book", "get_book_pages", "add_page",
      "get_page", "delete_book", "update_book", "delete_page",
      "clear_page", "copy_page", "reorder_pages", "save_change",
      "undo", "export_page", "export_book", "get_books_by_document",
    ],
    {
      conferenceSessionId: P.conferenceSessionId,
      bookId: P.bookId,
      pageId: P.pageId,
      documentId: P.documentId,
      bookData: { type: "object", description: "Book creation data" },
      pageData: { type: "object", description: "Page creation data" },
      bookUpdate: { type: "object", description: "Book update data" },
      changeData: { type: "object", description: "Page change data" },
      copyData: { type: "object", description: "Copy page data" },
      reorderData: { type: "object", description: "Reorder pages data" },
      cursorData: { type: "object", description: "Cursor state data" },
      demoStateData: { type: "object", description: "Demonstration state data" },
      limit: P.limit,
      offset: P.offset,
    },
    {
      load: { apiType: "clients", method: "GET", path: "/conference-sessions/{conferenceSessionId}/whiteboard", pathParams: ["conferenceSessionId"] },
      start_demo: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/demonstration/whiteboard/start", pathParams: ["conferenceSessionId"], bodyParam: "bookId" },
      stop_demo: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/demonstration/whiteboard/stop", pathParams: ["conferenceSessionId"], emptyBody: true },
      update_cursor: { apiType: "clients", method: "PATCH", path: "/conference-sessions/{conferenceSessionId}/demonstration/whiteboard/cursor", pathParams: ["conferenceSessionId"], bodyParam: "cursorData" },
      update_demo_state: { apiType: "clients", method: "PATCH", path: "/conference-sessions/{conferenceSessionId}/demonstration/whiteboard/state", pathParams: ["conferenceSessionId"], bodyParam: "demoStateData" },
      get_books: { apiType: "clients", method: "GET", path: "/conference-sessions/{conferenceSessionId}/whiteboard/books", pathParams: ["conferenceSessionId"] },
      add_book: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/whiteboard/books", pathParams: ["conferenceSessionId"], bodyParam: "bookData" },
      get_book_pages: { apiType: "clients", method: "GET", path: "/conference-sessions/{conferenceSessionId}/whiteboard/books/{bookId}/pages", pathParams: ["conferenceSessionId", "bookId"], queryParams: ["limit", "offset"] },
      add_page: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/whiteboard/books/{bookId}/pages", pathParams: ["conferenceSessionId", "bookId"], bodyParam: "pageData" },
      get_page: { apiType: "clients", method: "GET", path: "/conference-sessions/{conferenceSessionId}/whiteboard/books/{bookId}/pages/{pageId}", pathParams: ["conferenceSessionId", "bookId", "pageId"] },
      delete_book: { apiType: "clients", method: "DELETE", path: "/conference-sessions/{conferenceSessionId}/whiteboard/books/{bookId}", pathParams: ["conferenceSessionId", "bookId"] },
      update_book: { apiType: "clients", method: "PATCH", path: "/conference-sessions/{conferenceSessionId}/whiteboard/books/{bookId}", pathParams: ["conferenceSessionId", "bookId"], bodyParam: "bookUpdate" },
      delete_page: { apiType: "clients", method: "DELETE", path: "/conference-sessions/{conferenceSessionId}/whiteboard/books/{bookId}/pages/{pageId}", pathParams: ["conferenceSessionId", "bookId", "pageId"] },
      clear_page: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/whiteboard/books/{bookId}/pages/{pageId}/clear", pathParams: ["conferenceSessionId", "bookId", "pageId"], emptyBody: true },
      copy_page: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/whiteboard/books/{bookId}/pages/copy", pathParams: ["conferenceSessionId", "bookId"], bodyParam: "copyData" },
      reorder_pages: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/whiteboard/books/{bookId}/pages/reorder", pathParams: ["conferenceSessionId", "bookId"], bodyParam: "reorderData" },
      save_change: { apiType: "clients", method: "PATCH", path: "/conference-sessions/{conferenceSessionId}/whiteboard/books/{bookId}/pages/{pageId}", pathParams: ["conferenceSessionId", "bookId", "pageId"], bodyParam: "changeData" },
      undo: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/whiteboard/books/{bookId}/pages/{pageId}/undo", pathParams: ["conferenceSessionId", "bookId", "pageId"], emptyBody: true },
      export_page: { apiType: "clients", method: "GET", path: "/conference-sessions/{conferenceSessionId}/whiteboard/books/{bookId}/pages/{pageId}/export", pathParams: ["conferenceSessionId", "bookId", "pageId"] },
      export_book: { apiType: "clients", method: "GET", path: "/conference-sessions/{conferenceSessionId}/whiteboard/books/{bookId}/export", pathParams: ["conferenceSessionId", "bookId"] },
      get_books_by_document: { apiType: "clients", method: "GET", path: "/conference-sessions/{conferenceSessionId}/whiteboard/books/by-document/{documentId}", pathParams: ["conferenceSessionId", "documentId"] },
    },
    client,
  );
}