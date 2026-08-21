import type { IvaWsClient } from "../ws-client.js";
import type { ToolDefinition } from "../types.js";
import { errorResult, successResult } from "../error.js";

const EVENT_TYPES: Record<string, { wsPath: string; apiType: "clients"; needsSessionId?: boolean }> = {
  chat: { wsPath: "/websocket/chat", apiType: "clients" },
  chat_call: { wsPath: "/websockets/chatCallEvents", apiType: "clients" },
  conference_common: { wsPath: "/websocket/commonConferenceEvents", apiType: "clients" },
  conference_invitation: { wsPath: "/websocket/conferenceInvitationEvents", apiType: "clients" },
  active_conference_chat: { wsPath: "/websocket/chatActiveConferenceEvents", apiType: "clients" },
  active_conference_common: { wsPath: "/websocket/commonActiveConferenceEvents", apiType: "clients" },
  active_conference_presence: { wsPath: "/websocket/conferencePresenceControlEvents", apiType: "clients" },
  active_conference_inquiry: { wsPath: "/websocket/conferenceSessionInquiryEvents", apiType: "clients" },
  active_conference_whiteboard: { wsPath: "/websocket/conferenceSessionWhiteboardEvents", apiType: "clients" },
  active_conference_media: { wsPath: "/websocket/mediaActiveConferenceEvents", apiType: "clients" },
  active_conference_participants: { wsPath: "/websocket/participantActiveConferenceEvents", apiType: "clients" },
  active_conference_presentation: { wsPath: "/websocket/presentationActiveConferenceEvents", apiType: "clients" },
  active_conference_resources: { wsPath: "/websocket/resourcesActiveConferenceEvents", apiType: "clients" },
  contact: { wsPath: "/websocket/contactEvents", apiType: "clients" },
  group: { wsPath: "/websocket/groupEvents", apiType: "clients" },
  profile: { wsPath: "/websocket/profileEvents", apiType: "clients" },
  system: { wsPath: "/websocket/systemEvents", apiType: "clients" },
};

export function createEventsTool(wsClient: IvaWsClient): ToolDefinition {
  return {
    name: "iva_events",
    description:
      "Collect IVA events from WebSocket event channels (chat, conference, active conference, contact, group, profile, system). Connects to WebSocket, collects events for a specified duration, returns them as a JSON array. Clients API v2.28.12.",
    inputSchema: {
      type: "object",
      properties: {
        event_type: {
          type: "string",
          enum: Object.keys(EVENT_TYPES),
          description: "Event channel type to subscribe to",
        },
        duration: {
          type: "integer",
          description: "How long to collect events in seconds (default 10, max 60)",
          default: 10,
        },
        conferenceSessionId: {
          type: "string",
          description: "Conference session ID (for active conference event types)",
        },
      },
      required: ["event_type"],
    },
    handler: async (args) => {
      const eventType = args.event_type as string;
      const config = EVENT_TYPES[eventType];
      if (!config) {
        return errorResult(
          `Unknown event type: ${eventType}. Available: ${Object.keys(EVENT_TYPES).join(", ")}`,
        );
      }

      const duration = Math.min(Number(args.duration) || 10, 60);
      const pathParams: Record<string, string | number> = {};
      if (args.conferenceSessionId) {
        pathParams.conferenceSessionId = args.conferenceSessionId as string;
      }

      try {
        const events = await wsClient.collectEvents({
          apiType: config.apiType,
          wsPath: config.wsPath,
          pathParams: Object.keys(pathParams).length > 0 ? pathParams : undefined,
          duration,
        });
        return successResult(events);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return errorResult(message);
      }
    },
  };
}