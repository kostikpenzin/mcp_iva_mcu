import type { IvaApiClient } from "../../api-client.js";
import type { ToolDefinition } from "../../types.js";
import { createActionTool } from "../framework.js";
import { P } from "../params.js";

export function createUserSessionTool(client: IvaApiClient): ToolDefinition {
  return createActionTool(
    "iva_user_session",
    "IVA user session management: logout, session info, guest login, session state, login URL. Clients API v2.28.12. Note: login and 2FA actions are excluded for security — authentication is handled automatically via IVA_LOGIN/IVA_PASSWORD environment variables.",
    [
      "login_as_guest",
      "logout", "get_session_info", "set_session_state", "get_login_url",
    ],
    {
      sessionState: { type: "string", description: "Session state to set" },
      loginUrlType: { type: "string", description: "Login URL type" },
    },
    {
      login_as_guest: { apiType: "clients", method: "POST", path: "/login-as-guest", emptyBody: true },
      logout: { apiType: "clients", method: "POST", path: "/logout", emptyBody: true },
      get_session_info: { apiType: "clients", method: "GET", path: "/session/info" },
      set_session_state: { apiType: "clients", method: "POST", path: "/session/state", bodyParam: "sessionState", bodyWrapper: "state" },
      get_login_url: { apiType: "clients", method: "GET", path: "/login-url", queryParams: ["loginUrlType"] },
    },
    client,
    {
      login_as_guest: "Log in as a guest (no credentials, anonymous access). Войти как гость.",
      logout: "Log out of IVA and end the current session. Выйти из системы. Завершить сессию.",
      get_session_info: "Get information about the current user session (profile, state, capabilities). Получить информацию о сессии.",
      set_session_state: "Set/update the session state (e.g. online/away/do-not-disturb). Установить состояние сессии.",
      get_login_url: "Get a login URL for a specified login type (e.g. SSO, OAuth redirect). Получить URL для входа.",
    },
  );
}