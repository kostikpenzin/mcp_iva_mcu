import type { IvaApiClient } from "../../api-client.js";
import type { ToolDefinition } from "../../types.js";
import { createActionTool } from "../framework.js";
import { P } from "../params.js";

export function createConferenceSelfRegistrationTool(client: IvaApiClient): ToolDefinition {
  return createActionTool(
    "iva_conference_self_registration",
    "IVA conference self-registration: register, check email, resend email. Clients API v2.28.12.",
    ["register", "check_email", "resend_email"],
    {
      conferenceSessionId: P.conferenceSessionId,
      registrationData: { type: "object", description: "Self-registration data" },
      emailData: { type: "object", description: "Email check/resend data" },
    },
    {
      register: { apiType: "clients", method: "POST", path: "/public/conference-sessions/{conferenceSessionId}/self-registration", pathParams: ["conferenceSessionId"], bodyParam: "registrationData" },
      check_email: { apiType: "clients", method: "POST", path: "/public/conference-sessions/{conferenceSessionId}/self-registration/check-email", pathParams: ["conferenceSessionId"], bodyParam: "emailData" },
      resend_email: { apiType: "clients", method: "POST", path: "/public/conference-sessions/{conferenceSessionId}/self-registration/resend-email", pathParams: ["conferenceSessionId"], bodyParam: "emailData" },
    },
    client,
    {
      register: "Самостоятельная регистрация на конференцию. / Self-register for the conference.",
      check_email: "Проверить email при самостоятельной регистрации. / Check email for self-registration.",
      resend_email: "Отправить повторно email подтверждения регистрации. / Resend self-registration confirmation email.",
    },
  );
}