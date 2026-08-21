import type { IvaApiClient } from "../../api-client.js";
import type { ToolDefinition } from "../../types.js";
import { createActionTool } from "../framework.js";
import { P } from "../params.js";

export function createUserSessionTool(client: IvaApiClient): ToolDefinition {
  return createActionTool(
    "iva_user_session",
    "IVA user session management: login, logout, 2FA, session info, guest login, login exchange. Clients API v2.28.12.",
    [
      "login", "login_with_token", "login_as_guest", "login_exchange",
      "logout", "get_session_info", "set_session_state", "get_login_url",
      "2fa_renew", "2fa_verify",
    ],
    {
      credentials: { type: "object", description: "Login credentials {login, password}" },
      token: { type: "string", description: "Auth token for token-based login" },
      loginType: { type: "string", description: "Login type for exchange" },
      sessionState: { type: "string", description: "Session state to set" },
      twoFAChallengeId: P.twoFAChallengeId,
      oneTimePassword: { type: "string", description: "2FA one-time password" },
      loginUrlType: { type: "string", description: "Login URL type" },
    },
    {
      login: { apiType: "clients", method: "POST", path: "/login", bodyParam: "credentials" },
      login_with_token: { apiType: "clients", method: "POST", path: "/login-with-token", bodyParam: "credentials" },
      login_as_guest: { apiType: "clients", method: "POST", path: "/login-as-guest", emptyBody: true },
      login_exchange: { apiType: "clients", method: "POST", path: "/login-exchange", bodyParam: "credentials" },
      logout: { apiType: "clients", method: "POST", path: "/logout", emptyBody: true },
      get_session_info: { apiType: "clients", method: "GET", path: "/session/info" },
      set_session_state: { apiType: "clients", method: "POST", path: "/session/state", bodyParam: "sessionState" },
      get_login_url: { apiType: "clients", method: "GET", path: "/login-url", queryParams: ["loginUrlType"] },
      "2fa_renew": { apiType: "clients", method: "POST", path: "/2fa/{twoFAChallengeId}/renew", pathParams: ["twoFAChallengeId"], emptyBody: true },
      "2fa_verify": { apiType: "clients", method: "POST", path: "/2fa/{twoFAChallengeId}/verify", pathParams: ["twoFAChallengeId"], rawBody: true },
    },
    client,
  );
}