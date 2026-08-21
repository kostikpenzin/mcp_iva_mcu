import type { IvaApiClient } from "../../api-client.js";
import type { ToolDefinition } from "../../types.js";
import { createActionTool } from "../framework.js";
import { P } from "../params.js";

export function createScreenshareTool(client: IvaApiClient): ToolDefinition {
  return createActionTool(
    "iva_screenshare",
    "IVA screenshare: start/stop web or VNC screen demonstration, request/respond/stop remote control, batch respond. Clients API v2.28.12.",
    [
      "start_web", "start_vnc", "stop",
      "request_remote_control", "respond_remote_control",
      "batch_respond_remote_control", "stop_remote_control",
    ],
    {
      conferenceSessionId: P.conferenceSessionId,
      conferenceSessionParticipantId: P.participantId,
      presentationOwnerParticipantId: P.presentationOwnerParticipantId,
      controlData: { type: "object", description: "Remote control request/response data" },
      batchData: { type: "object", description: "Batch remote control response data" },
      startData: { type: "object", description: "Screen share start data" },
    },
    {
      start_web: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/demonstration/screenshare/start", pathParams: ["conferenceSessionId"], bodyParam: "startData" },
      start_vnc: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/demonstration/screenshare/start-vnc", pathParams: ["conferenceSessionId"], bodyParam: "startData" },
      stop: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/demonstration/screenshare/stop", pathParams: ["conferenceSessionId"], emptyBody: true },
      request_remote_control: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/demonstration/screenshare/remote-control/request", pathParams: ["conferenceSessionId"], bodyParam: "controlData" },
      respond_remote_control: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/demonstration/screenshare/remote-control/respond", pathParams: ["conferenceSessionId"], bodyParam: "controlData" },
      batch_respond_remote_control: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/demonstration/screenshare/remote-control/respond-batch", pathParams: ["conferenceSessionId"], bodyParam: "batchData" },
      stop_remote_control: { apiType: "clients", method: "POST", path: "/conference-sessions/{conferenceSessionId}/demonstration/screenshare/remote-control/stop", pathParams: ["conferenceSessionId"], emptyBody: true },
    },
    client,
    {
      start_web: "Start web (browser) screen sharing in the conference. Начать демонстрацию экрана (веб). Показать экран.",
      start_vnc: "Start VNC-based screen sharing (remote desktop). Начать демонстрацию VNC-экрана.",
      stop: "Stop screen sharing. Остановить демонстрацию экрана. Прекратить показ экрана.",
      request_remote_control: "Request remote control of a shared screen. Запросить удалённое управление экраном.",
      respond_remote_control: "Respond to a remote control request (accept/reject). Ответить на запрос удалённого управления.",
      batch_respond_remote_control: "Respond to multiple remote control requests at once (batch accept/reject).",
      stop_remote_control: "Stop/terminate an active remote control session. Остановить удалённое управление.",
    },
  );
}