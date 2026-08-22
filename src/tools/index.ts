import type { IvaApiClient } from "../api-client.js";
import type { ToolDefinition } from "../types.js";

// Clients API tools
import { createUserSessionTool } from "./clients/user-session.js";
import { createProfileTool } from "./clients/profile.js";
import { createContactsTool } from "./clients/contacts.js";
import { createInterlocutorsTool } from "./clients/interlocutors.js";
import { createDevicesTool } from "./clients/devices.js";
import { createDocumentsTool } from "./clients/documents.js";
import { createFileResourcesTool } from "./clients/file-resources.js";
import { createSystemTool } from "./clients/system.js";
import { createChatTool } from "./clients/chat.js";
import { createChatParticipantsTool } from "./clients/chat-participants.js";
import { createChatMessagesTool } from "./clients/chat-messages.js";
import { createChatCallTool } from "./clients/chat-call.js";
import { createConferenceTool } from "./clients/conference.js";
import { createConferenceSessionTool } from "./clients/conference-session.js";
import { createConferenceSessionGroupsTool } from "./clients/conference-session-groups.js";
import { createConferenceMediaTool } from "./clients/conference-media.js";
import { createConferenceParticipantsTool } from "./clients/conference-participants.js";
import { createConferenceLobbyTool } from "./clients/conference-lobby.js";
import { createConferenceDocumentsTool } from "./clients/conference-documents.js";
import { createConferenceInquiryTool } from "./clients/conference-inquiry.js";
import { createConferenceChatTool } from "./clients/conference-chat.js";
import { createConferenceQuestionnaireTool } from "./clients/conference-questionnaire.js";
import { createConferencePresenceControlTool } from "./clients/conference-presence-control.js";
import { createConferenceSelfRegistrationTool } from "./clients/conference-self-registration.js";
import { createConferenceStatisticsTool } from "./clients/conference-statistics.js";
import { createConferenceTemplatesTool } from "./clients/conference-templates.js";
import { createWhiteboardTool } from "./clients/whiteboard.js";
import { createScreenshareTool } from "./clients/screenshare.js";

export function getAllTools(
  client: IvaApiClient,
): ToolDefinition[] {
  return [
    // Clients API (28 tools)
    createUserSessionTool(client),
    createProfileTool(client),
    createContactsTool(client),
    createInterlocutorsTool(client),
    createDevicesTool(client),
    createDocumentsTool(client),
    createFileResourcesTool(client),
    createSystemTool(client),
    createChatTool(client),
    createChatParticipantsTool(client),
    createChatMessagesTool(client),
    createChatCallTool(client),
    createConferenceTool(client),
    createConferenceSessionTool(client),
    createConferenceSessionGroupsTool(client),
    createConferenceMediaTool(client),
    createConferenceParticipantsTool(client),
    createConferenceLobbyTool(client),
    createConferenceDocumentsTool(client),
    createConferenceInquiryTool(client),
    createConferenceChatTool(client),
    createConferenceQuestionnaireTool(client),
    createConferencePresenceControlTool(client),
    createConferenceSelfRegistrationTool(client),
    createConferenceStatisticsTool(client),
    createConferenceTemplatesTool(client),
    createWhiteboardTool(client),
    createScreenshareTool(client),
  ];
}