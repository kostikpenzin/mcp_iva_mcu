import type { IvaApiClient } from "../../api-client.js";
import type { ToolDefinition } from "../../types.js";
import { createActionTool } from "../framework.js";
import { P } from "../params.js";

export function createConferenceStatisticsTool(client: IvaApiClient): ToolDefinition {
  return createActionTool(
    "iva_conference_statistics",
    "IVA conference statistics: get session/participant statistics, participants activity, sessions statistics aggregation, export to CSV, user participation statistics. Clients API v2.28.12.",
    [
      "get_session_stats", "get_session_participants_stats",
      "get_participant_stats", "get_participants_activity",
      "get_sessions_stats", "get_sessions_stats_aggregation",
      "get_sessions_participants_activity",
      "get_user_participation", "get_user_participation_aggregation",
      "export_participants_stats", "export_sessions_stats",
      "export_user_participation",
      "get_session_stats_v2", "get_session_participants_stats_v2",
      "get_participant_stats_v2", "get_participants_activity_v2",
      "export_participants_stats_v2",
    ],
    {
      conferenceSessionId: P.conferenceSessionId,
      participantId: P.participantId,
      conferenceSessionStatisticId: P.conferenceSessionStatisticId,
      dateFrom: P.dateFrom,
      dateTo: P.dateTo,
      limit: P.limit,
      offset: P.offset,
      sortBy: P.sortBy,
      sortDirection: P.sortDirection,
    },
    {
      get_session_stats: { apiType: "clients", method: "GET", path: "/conference-sessions/{conferenceSessionId}/statistics/aggregation", pathParams: ["conferenceSessionId"] },
      get_session_participants_stats: { apiType: "clients", method: "GET", path: "/conference-sessions/{conferenceSessionId}/participants/statistics", pathParams: ["conferenceSessionId"], queryParams: ["limit", "offset"] },
      get_participant_stats: { apiType: "clients", method: "GET", path: "/conference-sessions/{conferenceSessionId}/participants/{participantId}/statistics", pathParams: ["conferenceSessionId", "participantId"] },
      get_participants_activity: { apiType: "clients", method: "GET", path: "/conference-sessions/{conferenceSessionId}/participants/statistics/activity", pathParams: ["conferenceSessionId"] },
      get_sessions_stats: { apiType: "clients", method: "GET", path: "/conference-sessions/statistics", queryParams: ["dateFrom", "dateTo", "limit", "offset", "sortBy", "sortDirection"] },
      get_sessions_stats_aggregation: { apiType: "clients", method: "GET", path: "/conference-sessions/statistics/aggregation", queryParams: ["dateFrom", "dateTo"] },
      get_sessions_participants_activity: { apiType: "clients", method: "GET", path: "/conference-sessions/statistics/participation-activity", queryParams: ["dateFrom", "dateTo", "limit", "offset"] },
      get_user_participation: { apiType: "clients", method: "GET", path: "/conference-sessions/statistics/user-participation", queryParams: ["dateFrom", "dateTo", "limit", "offset", "sortBy", "sortDirection"] },
      get_user_participation_aggregation: { apiType: "clients", method: "GET", path: "/conference-sessions/statistics/user-participation/aggregation", queryParams: ["dateFrom", "dateTo"] },
      export_participants_stats: { apiType: "clients", method: "GET", path: "/conference-sessions/{conferenceSessionId}/participants/statistics/export", pathParams: ["conferenceSessionId"] },
      export_sessions_stats: { apiType: "clients", method: "GET", path: "/conference-sessions/statistics/export", queryParams: ["dateFrom", "dateTo"] },
      export_user_participation: { apiType: "clients", method: "GET", path: "/conference-sessions/statistics/user-participation/export", queryParams: ["dateFrom", "dateTo"] },
      get_session_stats_v2: { apiType: "clients", method: "GET", path: "/conference-sessions/statistics/{conferenceSessionStatisticId}/aggregation", pathParams: ["conferenceSessionStatisticId"] },
      get_session_participants_stats_v2: { apiType: "clients", method: "GET", path: "/conference-sessions/statistics/{conferenceSessionStatisticId}/participants", pathParams: ["conferenceSessionStatisticId"], queryParams: ["limit", "offset"] },
      get_participant_stats_v2: { apiType: "clients", method: "GET", path: "/conference-sessions/statistics/{conferenceSessionStatisticId}/participants/{participantId}", pathParams: ["conferenceSessionStatisticId", "participantId"] },
      get_participants_activity_v2: { apiType: "clients", method: "GET", path: "/conference-sessions/statistics/{conferenceSessionStatisticId}/participants/activity", pathParams: ["conferenceSessionStatisticId"] },
      export_participants_stats_v2: { apiType: "clients", method: "GET", path: "/conference-sessions/statistics/{conferenceSessionStatisticId}/participants/export", pathParams: ["conferenceSessionStatisticId"] },
    },
    client,
  );
}