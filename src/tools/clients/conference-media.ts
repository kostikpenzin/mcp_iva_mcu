import type { IvaApiClient } from "../../api-client.js";
import type { ToolDefinition } from "../../types.js";
import { createActionTool } from "../framework.js";
import { P } from "../params.js";

export function createConferenceMediaTool(client: IvaApiClient): ToolDefinition {
  return createActionTool(
    "iva_conference_media",
    "IVA conference media: get media/room info, report media state, request/revoke attention, report equipment, set layout/media-profile/broadcast-language/original-volume/screen-orientation/translation-direction. Clients API v2.28.12.",
    [
      "get_info", "get_room_info", "report_media_state",
      "request_attention", "revoke_attention",
      "report_equipment", "set_layout", "set_media_profile",
      "set_broadcast_language", "set_original_volume",
      "set_screen_orientation", "set_translation_direction",
    ],
    {
      conferenceSessionId: P.conferenceSessionId,
      mediaStateData: { type: "object", description: "Media state data" },
      attentionData: { type: "object", description: "Attention request data" },
      equipmentData: { type: "object", description: "Equipment data" },
      layout: P.layout,
      mediaProfile: P.mediaProfile,
      broadcastLanguage: P.broadcastLanguage,
      translationDirection: P.translationDirection,
      screenOrientation: P.screenOrientation,
      originalVolume: P.originalVolume,
    },
    {
      get_info: { apiType: "clients", method: "GET", path: "/conference-sessions/{conferenceSessionId}/media/info", pathParams: ["conferenceSessionId"] },
      get_room_info: { apiType: "clients", method: "GET", path: "/conference-sessions/{conferenceSessionId}/media/room-info", pathParams: ["conferenceSessionId"] },
      report_media_state: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/media/media-state", pathParams: ["conferenceSessionId"], bodyParam: "mediaStateData" },
      request_attention: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/media/request-attention", pathParams: ["conferenceSessionId"], bodyParam: "attentionData" },
      revoke_attention: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/media/revoke-attention-request", pathParams: ["conferenceSessionId"], emptyBody: true },
      report_equipment: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/media/equipment", pathParams: ["conferenceSessionId"], bodyParam: "equipmentData" },
      set_layout: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/media/layout", pathParams: ["conferenceSessionId"], bodyParam: "layout", bodyWrapper: "layout" },
      set_media_profile: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/media/media-profile", pathParams: ["conferenceSessionId"], bodyParam: "mediaProfile", bodyWrapper: "profileIndex" },
      set_broadcast_language: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/media/broadcast-language", pathParams: ["conferenceSessionId"], bodyParam: "broadcastLanguage", bodyWrapper: "language" },
      set_original_volume: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/media/original-volume", pathParams: ["conferenceSessionId"], bodyParam: "originalVolume", bodyWrapper: "volume" },
      set_screen_orientation: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/media/screen-orientation", pathParams: ["conferenceSessionId"], bodyParam: "screenOrientation", bodyWrapper: "screenOrientation" },
      set_translation_direction: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/media/translation-direction", pathParams: ["conferenceSessionId"], bodyParam: "translationDirection", bodyWrapper: "language" },
    },
    client,
    {
      get_info: "Получить информацию о медиа конференции. / Get conference media info.",
      get_room_info: "Получить информацию о комнате. / Get room info.",
      report_media_state: "Сообщить состояние медиа. / Report media state.",
      request_attention: "Запросить внимание (поднять руку). / Request attention (raise hand).",
      revoke_attention: "Отозвать запрос внимания. / Revoke attention request.",
      report_equipment: "Сообщить информацию об оборудовании. / Report equipment info.",
      set_layout: "Установить раскладку видео. / Set video layout.",
      set_media_profile: "Установить медиа-профиль. / Set media profile.",
      set_broadcast_language: "Установить язык вещания. / Set broadcast language.",
      set_original_volume: "Установить громкость оригинала. / Set original volume.",
      set_screen_orientation: "Установить ориентацию экрана. / Set screen orientation.",
      set_translation_direction: "Установить направление перевода. / Set translation direction.",
    },
  );
}