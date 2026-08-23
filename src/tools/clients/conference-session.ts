import type { IvaApiClient } from "../../api-client.js";
import type { ToolDefinition } from "../../types.js";
import { createActionTool } from "../framework.js";
import { P } from "../params.js";
import { API_VERSION } from "../../constants.js";

// Formats a duration in ms as a compact human-readable string, e.g. "1 ч 5 мин", "30 мин".
function fmtDuration(ms: number): string {
  if (!ms || ms <= 0) return "0 мин";
  const min = Math.round(ms / 60000);
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h ? (m ? `${h} ч ${m} мин` : `${h} ч`) : `${m} мин`;
}

// Enriches session list responses with the actual meeting duration computed
// from actualStartDate/actualEndDate, so the agent can answer "how long did
// meetings run" and "what % of the work week" without manual math.
function enrichSessionDurations(action: string, data: unknown): unknown {
  if (action !== "find" && action !== "find_sessions") return data;

  const enrich = (s: Record<string, unknown>): Record<string, unknown> => {
    const aStart = s.actualStartDate as number | undefined;
    const aEnd = s.actualEndDate as number | undefined;
    if (aStart && aEnd && aEnd > aStart) {
      const ms = aEnd - aStart;
      s.actualDurationMs = ms;
      s.actualDuration = fmtDuration(ms);
    }
    return s;
  };

  if (Array.isArray(data)) return data.map(enrich);
  if (typeof data === "object" && data !== null) {
    const obj = data as Record<string, unknown>;
    for (const key of ["data", "conferenceSessions", "items", "result"]) {
      if (Array.isArray(obj[key])) {
        obj[key] = (obj[key] as Record<string, unknown>[]).map(enrich);
        return data;
      }
    }
  }
  return data;
}

export function createConferenceSessionTool(client: IvaApiClient): ToolDefinition {
  return createActionTool(
    "iva_conference_session",
    `IVA conference session management: get/find/update/delete sessions, join/leave, start/stop, timer control, recording, transcription, subtitling, media publication, invitations, public info. Clients API ${API_VERSION}.`,
    [
      "get_public_by_id", "get_public_by_params", "get_join_info",
      "get", "delete", "update", "find", "find_rooms", "find_sessions",
      "get_layout_settings", "get_free_resources", "get_join_data",
      "get_periodical_by_number", "get_periodical_by_recurrence",
      "join", "leave", "restore", "start", "stop",
      "start_timer", "stop_timer", "pause_timer",
      "start_recording", "stop_recording",
      "start_transcription", "stop_transcription",
      "start_subtitling", "stop_subtitling",
      "set_media_publication", "start_media_publication", "stop_media_publication", "delete_media_publication",
      "reject_incoming_call", "respond_on_invitation", "confirm_record_access",
    ],
    {
      conferenceSessionId: P.conferenceSessionId,
      conferenceId: P.conferenceId,
      sessionUpdate: { type: "object", description: "Conference session update data" },
      joinData: { type: "object", description: "Join conference session data" },
      invitationResponse: { type: "object", description: "Invitation response" },
      mediaPublicationData: { type: "object", description: "Media publication data" },
      conferenceSessionNumber: P.conferenceSessionNumber,
      conferenceNumber: { type: "integer", description: "Conference number" },
      sessionNumber: { type: "integer", description: "Session number" },
      recurrenceDate: P.recurrenceDate,
      limit: P.limit,
      offset: P.offset,
      dateFrom: P.dateFrom,
      dateTo: P.dateTo,
      orderAsc: { type: "boolean", description: "Order ascending" },
      query: P.query,
    },
    {
      get_public_by_id: { apiType: "clients", method: "GET", path: "/public/conference-sessions/{conferenceSessionId}", pathParams: ["conferenceSessionId"] },
      get_public_by_params: { apiType: "clients", method: "GET", path: "/public/conference-sessions", queryParams: ["query", "limit", "offset"] },
      get_join_info: { apiType: "clients", method: "GET", path: "/public/conference-sessions/join-info", queryParams: ["conferenceNumber"] },
      get: { apiType: "clients", method: "GET", path: "/conference-sessions/{conferenceSessionId}", pathParams: ["conferenceSessionId"] },
      delete: { apiType: "clients", method: "DELETE", path: "/conference-sessions/{conferenceSessionId}", pathParams: ["conferenceSessionId"] },
      update: { apiType: "clients", method: "PATCH", path: "/conference-sessions/{conferenceSessionId}", pathParams: ["conferenceSessionId"], bodyParam: "sessionUpdate" },
      find: { apiType: "clients", method: "GET", path: "/conference-sessions", queryParams: ["dateFrom", "dateTo", "limit", "offset", "orderAsc"] },
      find_rooms: { apiType: "clients", method: "GET", path: "/conference-sessions/rooms", queryParams: ["limit", "offset"] },
      find_sessions: { apiType: "clients", method: "GET", path: "/conference-sessions/sessions", queryParams: ["dateFrom", "dateTo", "limit", "orderAsc"] },
      get_layout_settings: { apiType: "clients", method: "GET", path: "/conference-sessions/{conferenceSessionId}/layout", pathParams: ["conferenceSessionId"] },
      get_free_resources: { apiType: "clients", method: "GET", path: "/conference-sessions/{conferenceSessionId}/subscriptions/free-resources", pathParams: ["conferenceSessionId"] },
      get_join_data: { apiType: "clients", method: "GET", path: "/conference-sessions/{conferenceSessionId}/join-data", pathParams: ["conferenceSessionId"] },
      get_periodical_by_number: { apiType: "clients", method: "GET", path: "/conference-sessions/periodical", queryParams: ["conferenceId", "sessionNumber"] },
      get_periodical_by_recurrence: { apiType: "clients", method: "GET", path: "/conference-sessions/periodical-by-recurrence", queryParams: ["conferenceId", "recurrenceDate"] },
      join: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/join", pathParams: ["conferenceSessionId"], bodyParam: "joinData" },
      leave: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/leave", pathParams: ["conferenceSessionId"], emptyBody: true },
      restore: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/restore", pathParams: ["conferenceSessionId"], emptyBody: true },
      start: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/start", pathParams: ["conferenceSessionId"], emptyBody: true },
      stop: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/stop", pathParams: ["conferenceSessionId"], emptyBody: true },
      start_timer: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/timer/start", pathParams: ["conferenceSessionId"], emptyBody: true },
      stop_timer: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/timer/stop", pathParams: ["conferenceSessionId"], emptyBody: true },
      pause_timer: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/timer/pause", pathParams: ["conferenceSessionId"], emptyBody: true },
      start_recording: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/record/start", pathParams: ["conferenceSessionId"], emptyBody: true },
      stop_recording: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/record/stop", pathParams: ["conferenceSessionId"], emptyBody: true },
      start_transcription: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/transcription/start", pathParams: ["conferenceSessionId"], emptyBody: true },
      stop_transcription: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/transcription/stop", pathParams: ["conferenceSessionId"], emptyBody: true },
      start_subtitling: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/subtitle/start", pathParams: ["conferenceSessionId"], emptyBody: true },
      stop_subtitling: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/subtitle/stop", pathParams: ["conferenceSessionId"], emptyBody: true },
      set_media_publication: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/media-publication", pathParams: ["conferenceSessionId"], bodyParam: "mediaPublicationData" },
      start_media_publication: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/media-publication/start", pathParams: ["conferenceSessionId"], emptyBody: true },
      stop_media_publication: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/media-publication/stop", pathParams: ["conferenceSessionId"], emptyBody: true },
      delete_media_publication: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/media-publication/delete", pathParams: ["conferenceSessionId"], emptyBody: true },
      reject_incoming_call: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/reject-incoming-call", pathParams: ["conferenceSessionId"], emptyBody: true },
      respond_on_invitation: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/respond-on-invitation", pathParams: ["conferenceSessionId"], bodyParam: "invitationResponse" },
      confirm_record_access: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/stopped-event-confirm-access", pathParams: ["conferenceSessionId"], emptyBody: true },
    },
    client,
    {
      get_public_by_id: "Get public conference session info by ID (no auth required)",
      get_public_by_params: "Get public conference session info by parameters",
      get_join_info: "Get join info for a conference session (public)",
      get: "Get conference session details by ID",
      delete: "Delete a conference session",
      update: "Update conference session properties",
      find: "Find/list conference sessions. Use when user says 'покажи встречи', 'list meetings', 'найди конференцию'. Optional: dateFrom, dateTo, limit, offset, sortBy, sortDirection. Response is enriched with actualDurationMs / actualDuration (computed from actualStartDate/actualEndDate) for finished sessions, so total meeting time can be summed directly.",
      find_rooms: "Find conference rooms",
      find_sessions: "Find conference sessions (alternative search)",
      get_layout_settings: "Get layout settings for a session",
      get_free_resources: "Get free resources for a session",
      get_join_data: "Get join data for a session",
      get_periodical_by_number: "Get periodical session by conference number",
      get_periodical_by_recurrence: "Get periodical session by recurrence date",
      join: "Join a conference session. Use when user says 'войди в конференцию', 'join meeting'.",
      leave: "Leave a conference session",
      restore: "Restore a conference session",
      start: "Start a conference session",
      stop: "Stop a conference session",
      start_timer: "Start session timer",
      stop_timer: "Stop session timer",
      pause_timer: "Pause session timer",
      start_recording: "Start recording. Use when user says 'начни запись', 'start recording'.",
      stop_recording: "Stop recording",
      start_transcription: "Start transcription. Use when user says 'включи транскрипцию', 'start transcription'.",
      stop_transcription: "Stop transcription",
      start_subtitling: "Start subtitling",
      stop_subtitling: "Stop subtitling",
      set_media_publication: "Set media publication settings",
      start_media_publication: "Start media publication (stream/broadcast)",
      stop_media_publication: "Stop media publication",
      delete_media_publication: "Delete media publication",
      reject_incoming_call: "Reject an incoming call in session",
      respond_on_invitation: "Respond to session invitation",
      confirm_record_access: "Confirm access to stopped event recording",
    },
    enrichSessionDurations,
  );
}