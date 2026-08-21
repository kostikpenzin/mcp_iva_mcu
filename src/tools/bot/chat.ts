import type { IvaApiClient } from "../../api-client.js";
import type { ToolDefinition } from "../../types.js";
import { createActionTool } from "../framework.js";
import { P } from "../params.js";

export function createBotChatTool(client: IvaApiClient): ToolDefinition {
  return createActionTool(
    "iva_bot_chat",
    "IVA Bot API — chat operations: send message, create resource, upload file, download file. Bot API v1.28.12.",
    ["send_message", "create_resource", "upload_file", "download_file"],
    {
      chatRoomId: P.chatRoomId,
      resourceId: P.resourceId,
      messageData: { type: "object", description: "Message data to send" },
      resourceData: { type: "object", description: "Resource creation data" },
      fileData: { type: "object", description: "File upload data" },
    },
    {
      send_message: { apiType: "bot", method: "POST", path: "/chats/{chatRoomId}/send-message", pathParams: ["chatRoomId"], bodyParam: "messageData" },
      create_resource: { apiType: "bot", method: "POST", path: "/chats/{chatRoomId}/files/create", pathParams: ["chatRoomId"], bodyParam: "resourceData" },
      upload_file: { apiType: "bot", method: "POST", path: "/chats/{chatRoomId}/files/{resourceId}", pathParams: ["chatRoomId", "resourceId"], bodyParam: "fileData" },
      download_file: { apiType: "bot", method: "GET", path: "/chats/{chatRoomId}/files/{resourceId}", pathParams: ["chatRoomId", "resourceId"] },
    },
    client,
  );
}