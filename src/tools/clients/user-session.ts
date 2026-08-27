import type { IvaApiClient } from "../../api-client.js";
import type { ToolDefinition } from "../../types.js";
import { createActionTool } from "../framework.js";
import { P } from "../params.js";
import { API_VERSION } from "../../constants.js";

export function createUserSessionTool(client: IvaApiClient): ToolDefinition {
  return createActionTool(
    "iva_user_session",
    `IVA user session management: logout, session info, guest login, session state, login URL. Clients API ${API_VERSION}. Note: login and 2FA actions are excluded for security — authentication is handled automatically via IVA_LOGIN/IVA_PASSWORD environment variables.`,
    [
      "login_as_guest",
      "logout", "get_session_info", "set_session_state", "get_login_url",
    ],
    {
      sessionState: { type: "string", description: "Session state to set" },
      providerId: { type: "string", description: "Login provider ID" },
    },
    {
      login_as_guest: { apiType: "clients", method: "POST", path: "/login-as-guest", emptyBody: true },
      logout: { apiType: "clients", method: "POST", path: "/logout", emptyBody: true },
      get_session_info: { apiType: "clients", method: "GET", path: "/session/info" },
      set_session_state: { apiType: "clients", method: "POST", path: "/session/state", bodyParam: "sessionState", bodyWrapper: "sessionState" },
      get_login_url: { apiType: "clients", method: "GET", path: "/login-url", queryParams: ["providerId"] },
    },
    client,
    {
      login_as_guest: "Log in as a guest (no credentials, anonymous access). Войти как гость.",
      logout: "Log out of IVA and end the current session. Выйти из системы. Завершить сессию.",
      get_session_info: "Get information about the current user session (profile, state, capabilities). Получить информацию о сессии.",
      set_session_state: "Set/update the session state (e.g. online/away/do-not-disturb). Установить состояние сессии.",
      get_login_url: "Get a login URL for a specified login type (e.g. SSO, OAuth redirect). Получить URL для входа.",
    },
    // After logout the auto-login session is dead on the server; drop the
    // cached token so the next request re-authenticates instead of replaying it.
    (action, data) => {
      if (action === "logout") client.clearSessionToken();
      return data;
    },
  );
}