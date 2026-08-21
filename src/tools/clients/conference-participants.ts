import type { IvaApiClient } from "../../api-client.js";
import type { ToolDefinition } from "../../types.js";
import { createActionTool } from "../framework.js";
import { P } from "../params.js";

export function createConferenceParticipantsTool(client: IvaApiClient): ToolDefinition {
  return createActionTool(
    "iva_conference_participants",
    "IVA conference participants: add/remove/find/get/disconnect participants, mute/unmute media, hand up/down, DTMF, reactions, audio callback, outgoing calls, layout settings, update settings, return to lobby. Clients API v2.28.12.",
    [
      "get_public", "add", "find", "get", "get_by_profile",
      "get_layout_settings", "update", "remove", "disconnect",
      "mute_media_all", "mute_media", "unmute_media_all", "unmute_media",
      "hand_up", "hand_down", "set_reaction",
      "send_dtmf", "start_outgoing_call", "start_outgoing_call_to_phone",
      "cancel_outgoing_call", "start_audio_callback", "stop_audio_callback",
      "return_to_lobby",
    ],
    {
      conferenceSessionId: P.conferenceSessionId,
      participantId: P.participantId,
      profileId: P.profileId,
      participants: P.participants,
      participantIds: P.participantIds,
      muteData: { type: "object", description: "Mute data {mediaType, participantIds}" },
      participantUpdate: { type: "object", description: "Participant settings update" },
      reaction: P.reaction,
      dtmfData: P.dtmf,
      callData: { type: "object", description: "Outgoing call data" },
      callbackData: { type: "object", description: "Audio callback data" },
      limit: P.limit,
      offset: P.offset,
    },
    {
      get_public: { apiType: "clients", method: "GET", path: "/public/conference-sessions/{conferenceSessionId}/participants", pathParams: ["conferenceSessionId"] },
      add: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/participants/add", pathParams: ["conferenceSessionId"], bodyParam: "participants" },
      find: { apiType: "clients", method: "GET", path: "/conference-sessions/{conferenceSessionId}/participants/find", pathParams: ["conferenceSessionId"], queryParams: ["limit", "offset"] },
      get: { apiType: "clients", method: "GET", path: "/conference-sessions/{conferenceSessionId}/participants/{participantId}", pathParams: ["conferenceSessionId", "participantId"] },
      get_by_profile: { apiType: "clients", method: "GET", path: "/conference-sessions/{conferenceSessionId}/participants/by-profile", pathParams: ["conferenceSessionId"], queryParams: ["profileId"] },
      get_layout_settings: { apiType: "clients", method: "GET", path: "/conference-sessions/{conferenceSessionId}/participants/{participantId}/layout", pathParams: ["conferenceSessionId", "participantId"] },
      update: { apiType: "clients", method: "PATCH", path: "/conference-sessions/{conferenceSessionId}/participants/{participantId}/settings", pathParams: ["conferenceSessionId", "participantId"], bodyParam: "participantUpdate" },
      remove: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/participants/remove", pathParams: ["conferenceSessionId"], bodyParam: "participantIds" },
      disconnect: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/participants/disconnect", pathParams: ["conferenceSessionId"], bodyParam: "participantIds" },
      mute_media_all: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/participants/mute-media", pathParams: ["conferenceSessionId"], bodyParam: "muteData" },
      mute_media: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/participants/{participantId}/mute-media", pathParams: ["conferenceSessionId", "participantId"], bodyParam: "muteData" },
      unmute_media_all: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/participants/unmute-media", pathParams: ["conferenceSessionId"], bodyParam: "muteData" },
      unmute_media: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/participants/{participantId}/unmute-media", pathParams: ["conferenceSessionId", "participantId"], bodyParam: "muteData" },
      hand_up: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/participants/{participantId}/hand-up", pathParams: ["conferenceSessionId", "participantId"], emptyBody: true },
      hand_down: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/participants/{participantId}/hand-down", pathParams: ["conferenceSessionId", "participantId"], emptyBody: true },
      set_reaction: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/participants/{participantId}/set-reaction", pathParams: ["conferenceSessionId", "participantId"], bodyParam: "reaction" },
      send_dtmf: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/participants/{participantId}/send-dtmf", pathParams: ["conferenceSessionId", "participantId"], bodyParam: "dtmfData" },
      start_outgoing_call: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/participants/{participantId}/start-outgoing-call", pathParams: ["conferenceSessionId", "participantId"], emptyBody: true },
      start_outgoing_call_to_phone: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/participants/start-outgoing-call", pathParams: ["conferenceSessionId"], bodyParam: "callData" },
      cancel_outgoing_call: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/participants/{participantId}/cancel-outgoing-call", pathParams: ["conferenceSessionId", "participantId"], emptyBody: true },
      start_audio_callback: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/participants/{participantId}/start-audio-callback", pathParams: ["conferenceSessionId", "participantId"], bodyParam: "callbackData" },
      stop_audio_callback: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/participants/{participantId}/stop-audio-callback", pathParams: ["conferenceSessionId", "participantId"], emptyBody: true },
      return_to_lobby: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/participants/{participantId}/return-to-lobby", pathParams: ["conferenceSessionId", "participantId"], emptyBody: true },
    },
    client,
  );
}