import type { IvaApiClient } from "../../api-client.js";
import type { ToolDefinition } from "../../types.js";
import { createActionTool } from "../framework.js";
import { P } from "../params.js";

export function createChatParticipantsTool(client: IvaApiClient): ToolDefinition {
  return createActionTool(
    "iva_chat_participants",
    "IVA chat participants: add and remove participants, update participant settings. Clients API v2.28.12.",
    ["add", "remove", "update"],
    {
      chatRoomId: P.chatRoomId,
      profileId: P.profileId,
      participants: P.participants,
      participantIds: P.participantIds,
      participantUpdate: { type: "object", description: "Participant settings to update" },
    },
    {
      add: { apiType: "clients", method: "POST", path: "/chats/{chatRoomId}/participants/add", pathParams: ["chatRoomId"], bodyParam: "participants" },
      remove: { apiType: "clients", method: "POST", path: "/chats/{chatRoomId}/participants/remove", pathParams: ["chatRoomId"], bodyParam: "participantIds", bodyWrapper: "participantIds" },
      update: { apiType: "clients", method: "PATCH", path: "/chats/{chatRoomId}/participants/{profileId}", pathParams: ["chatRoomId", "profileId"], bodyParam: "participantUpdate" },
    },
    client,
    {
      add: "Add participants to a chat room. Добавить участников в чат. Пригласить в чат.",
      remove: "Remove participants from a chat room. Удалить участников из чата. Исключить из чата.",
      update: "Update participant settings in a chat room (e.g. role, permissions, mute). Обновить настройки участника чата.",
    },
  );
}