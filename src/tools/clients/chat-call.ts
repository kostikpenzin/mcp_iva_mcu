import type { IvaApiClient } from "../../api-client.js";
import type { ToolDefinition } from "../../types.js";
import { createActionTool } from "../framework.js";
import { P } from "../params.js";
import { API_VERSION } from "../../constants.js";

export function createChatCallTool(client: IvaApiClient): ToolDefinition {
  return createActionTool(
    "iva_chat_call",
    `IVA chat calls: join/leave/hold calls, start/stop recording, start/stop screen sharing, transfer calls, DTMF, media state, start outgoing call, cancel outgoing call. Clients API ${API_VERSION}.`,
    [
      "get", "join", "join_v2", "start", "leave", "hold",
      "start_recording", "stop_recording",
      "start_screenshare", "stop_screenshare",
      "set_media_state", "send_dtmf",
      "start_outgoing_call", "cancel_outgoing_call",
      "transfer_to_call", "transfer_to_user",
    ],
    {
      chatRoomId: P.chatRoomId,
      profileId: P.profileId,
      mediaState: P.mediaState,
      dtmfData: P.dtmf,
      transferData: { type: "object", description: "Transfer data (target chatRoomId or profile)" },
      joinData: { type: "object", description: "Join call data (media constraints, ICE servers)" },
      callData: { type: "object", description: "Start call data" },
    },
    {
      get: { apiType: "clients", method: "GET", path: "/chat-calls/{chatRoomId}", pathParams: ["chatRoomId"] },
      join: { apiType: "clients", method: "POST", path: "/chat-calls/{chatRoomId}/join", pathParams: ["chatRoomId"], bodyParam: "joinData" },
      join_v2: { apiType: "clients", method: "POST", path: "/v2/chat-calls/{chatRoomId}/join", pathParams: ["chatRoomId"], bodyParam: "joinData" },
      start: { apiType: "clients", method: "POST", path: "/v2/chat-calls/{chatRoomId}/start", pathParams: ["chatRoomId"], bodyParam: "callData" },
      leave: { apiType: "clients", method: "POST", path: "/chat-calls/{chatRoomId}/leave", pathParams: ["chatRoomId"], emptyBody: true },
      hold: { apiType: "clients", method: "POST", path: "/chat-calls/{chatRoomId}/hold", pathParams: ["chatRoomId"], emptyBody: true },
      start_recording: { apiType: "clients", method: "POST", path: "/chat-calls/{chatRoomId}/record/start", pathParams: ["chatRoomId"], emptyBody: true },
      stop_recording: { apiType: "clients", method: "POST", path: "/chat-calls/{chatRoomId}/record/stop", pathParams: ["chatRoomId"], emptyBody: true },
      start_screenshare: { apiType: "clients", method: "POST", path: "/chat-calls/{chatRoomId}/demonstration/screenshare/start", pathParams: ["chatRoomId"], emptyBody: true },
      stop_screenshare: { apiType: "clients", method: "POST", path: "/chat-calls/{chatRoomId}/demonstration/screenshare/stop", pathParams: ["chatRoomId"], emptyBody: true },
      set_media_state: { apiType: "clients", method: "POST", path: "/chat-calls/{chatRoomId}/media-state", pathParams: ["chatRoomId"], bodyParam: "mediaState", bodyWrapper: "mediaState" },
      send_dtmf: { apiType: "clients", method: "POST", path: "/chat-calls/{chatRoomId}/participants/{profileId}/send-dtmf", pathParams: ["chatRoomId", "profileId"], bodyParam: "dtmfData", bodyWrapper: "code" },
      start_outgoing_call: { apiType: "clients", method: "POST", path: "/chat-calls/{chatRoomId}/participants/{profileId}/start-outgoing-call", pathParams: ["chatRoomId", "profileId"], emptyBody: true },
      cancel_outgoing_call: { apiType: "clients", method: "POST", path: "/chat-calls/{chatRoomId}/participants/{profileId}/cancel-outgoing-call", pathParams: ["chatRoomId", "profileId"], emptyBody: true },
      transfer_to_call: { apiType: "clients", method: "POST", path: "/chat-calls/{chatRoomId}/transfer-to-call", pathParams: ["chatRoomId"], bodyParam: "transferData" },
      transfer_to_user: { apiType: "clients", method: "POST", path: "/chat-calls/{chatRoomId}/transfer-to-user", pathParams: ["chatRoomId"], bodyParam: "transferData" },
    },
    client,
    {
      get: "Get the current state of a chat call (participants, media, status). Получить состояние звонка в чате.",
      join: "Join a chat call (audio/video). Присоединиться к звонку в чате. Войти в звонок.",
      join_v2: "Join a chat call (v2 endpoint with extended options). Присоединиться к звонку (v2).",
      start: "Start a new chat call (audio/video) in the chat room. Начать звонок в чате.",
      leave: "Leave the current chat call. Покинуть звонок. Выйти из звонка.",
      hold: "Put the chat call on hold. Поставить звонок на удержание.",
      start_recording: "Start recording the chat call. Начать запись звонка.",
      stop_recording: "Stop recording the chat call. Остановить запись звонка.",
      start_screenshare: "Start screen sharing inside a chat call. Начать демонстрацию экрана в звонке.",
      stop_screenshare: "Stop screen sharing inside a chat call. Остановить демонстрацию экрана в звонке.",
      set_media_state: "Set media state for the chat call (mute audio/video, camera on/off). Установить состояние медиа.",
      send_dtmf: "Send a DTMF tone (digit press) during the call. Отправить DTMF-сигнал.",
      start_outgoing_call: "Start an outgoing call from a participant in the chat.",
      cancel_outgoing_call: "Cancel an outgoing call that has not yet been answered. Отменить исходящий вызов.",
      transfer_to_call: "Transfer the current chat call to another chat call. Перевести звонок на другой звонок.",
      transfer_to_user: "Transfer the current chat call to another user. Перевести звонок на другого пользователя.",
    },
  );
}