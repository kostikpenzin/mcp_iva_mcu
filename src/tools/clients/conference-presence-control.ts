import type { IvaApiClient } from "../../api-client.js";
import type { ToolDefinition } from "../../types.js";
import { createActionTool } from "../framework.js";
import { P } from "../params.js";

export function createConferencePresenceControlTool(client: IvaApiClient): ToolDefinition {
  return createActionTool(
    "iva_conference_presence_control",
    "IVA conference presence control: start/stop presence control, confirm attendance. Clients API v2.28.12.",
    ["start", "stop", "confirm"],
    {
      conferenceSessionId: P.conferenceSessionId,
      presenceControlId: P.presenceControlId,
      startData: { type: "object", description: "Presence control start data" },
      confirmData: { type: "object", description: "Confirmation data" },
    },
    {
      start: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/presence-control/start", pathParams: ["conferenceSessionId"], bodyParam: "startData" },
      stop: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/presence-control/{presenceControlId}/stop", pathParams: ["conferenceSessionId", "presenceControlId"], emptyBody: true },
      confirm: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/presence-control/{presenceControlId}/confirm", pathParams: ["conferenceSessionId", "presenceControlId"], bodyParam: "confirmData" },
    },
    client,
  );
}