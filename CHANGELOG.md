# Changelog

## [2.0.3] — 2026-08-23

### Changed
- **Badge set refined.** Re-added `npm downloads` and added `Node.js ≥18`, `MCP protocol`, and `platform IVA 360 · Минцифры РФ` to the header badges in README (EN) and `i18n/README.ru.md` (RU), alongside the security cluster (dependencies: 0 vulnerabilities, secrets: none hardcoded, malware: none detected). Removed only the low-signal badges (GitHub stars, GitHub issues, TypeScript version, TypeScript strict).
- Version bumped to **2.0.3** (docs-only).

---

## [2.0.2] — 2026-08-23

### Changed
- **Badges trimmed to the essential set** under the title in README (EN) and `i18n/README.ru.md` (RU). Kept: npm version, license, tests (58). Removed: npm downloads, Node.js, TypeScript, GitHub stars, GitHub issues, TypeScript strict, MCP protocol, platform.
- **Security badges consolidated** and linked to the Security section: `dependencies: 0 vulnerabilities`, `secrets: none hardcoded`, and a new `malware: none detected` badge (RU: `вредонос: не обнаружен`) — the explicit "no viruses" indicator that was missing.
- Version bumped to **2.0.2** (docs-only).

---

## [2.0.1] — 2026-08-23

### Added
- **Author metadata.** `package.json` now declares `"author": "Penzin Konstantin <penzin85@gmail.com> (https://github.com/kostikpenzin)"`. README (EN) and `i18n/README.ru.md` (RU) show an "Author / Автор" line in the header.

### Changed
- **Destructive action confirmation** is now described in the server `instructions` (`src/index.ts`) so MCP clients surface the feature: when `IVA_CONFIRM_DESTRUCTIVE=true`, destructive actions require an explicit `confirm: true`; otherwise a warning is returned instead of executing. The feature itself was already present and is documented in the README "Destructive Action Confirmation" section and the Environment Variables table.
- Version bumped to **2.0.1**.

---

## [2.0.0] — 2026-08-23

### Removed (breaking)
- **Integration API and Bot API removed.** The project now wraps only the IVA Clients API. Deleted `src/tools/integration/` (11 tools) and `src/tools/bot/` (1 tool) along with their OpenAPI specs (`specs/integration-openapi.json`, `specs/bot-openapi.json`). Tool count: 40 → 28.
- **Removed environment variables** `IVA_INTEGRATION_TOKEN` and `IVA_BOT_TOKEN`. The `IvaConfig` type, `ApiType` union (`"integration"` / `"bot"`), API path map, and auth-header branches for these API types were removed from `src/types.ts`, `src/api-client.ts`, and `src/config.ts`.
- Removed Integration/Bot sections from the server `instructions` in `src/index.ts` and from `package.json` description (dropped the `bot-api` keyword).

### Added
- **Auto-relogin on 401.** When a Clients API request returns 401 (expired session) and auth is via `IVA_LOGIN`/`IVA_PASSWORD`, the API client now drops the cached session token, re-logs in, and retries the request once — fixing the "401: No auth context" failures seen when a session expires mid-use. Static `IVA_SESSION_TOKEN`/`IVA_JWT_TOKEN` auth is not retried (no way to refresh). Implemented in `src/api-client.ts` (`canReauth()` + retry-once in `doRequest`).
- **Actual meeting duration in `iva_conference_session` `find`.** The `find`/`find_sessions` responses are now enriched with `actualDurationMs` and a human-readable `actualDuration` (e.g. "1 ч 5 мин"), computed from `actualStartDate`/`actualEndDate` for finished sessions. Lets the agent answer "how long did meetings run" and "what % of the work week" without manual math. Implemented via `enrichSessionDurations` transform in `src/tools/clients/conference-session.ts`.
- **New README usage scenario** "Analyze this week's meetings and time spent" (EN + RU): find sessions in a date range, sum `actualDurationMs`, report % of a 40-hour week. Notes that call history is not exposed by the Clients API (only live call state via `iva_chat_call`).

### Changed
- Version bumped to **2.0.0** (breaking change — public tool surface and env vars removed).
- **`User-Agent: mcp-iva360` header** now sent on every IVA API request (added in `src/api-client.ts`), so the MCP server can be identified in IVA access logs. Override per-request via `opts.headers["User-Agent"]`.
- README (EN) and `i18n/README.ru.md` (RU) updated: header stats (40 tools · 375 actions · 368 endpoints · 55 tests → 28 tools · 304 actions · 310 endpoints · 58 tests), Compatible API Versions table, Environment Variables table, MCP client config examples, Tools Overview, Capabilities, Usage Scenarios (dropped "Create a new user (Integration API)" scenario; added "Analyze this week's meetings and time spent"), and Project Structure.
- **MCP client config examples simplified** to the minimal env set (`IVA_BASE_URL`, `IVA_LOGIN`, `IVA_PASSWORD`) across all variants (Claude Desktop npx/Windows/Docker, Cursor, VS Code, Codex CLI, From source); removed `IVA_CONFIRM_DESTRUCTIVE` from the example JSON blocks. The "Destructive Action Confirmation" section was condensed to a single paragraph (removed the verbose code-block examples). The `IVA_CONFIRM_DESTRUCTIVE` env var and the feature remain supported and documented in the Environment Variables table.
- `src/tools/index.test.ts`: tool count 40 → 28, total-actions threshold 300 → 250; removed the Integration (11) and Bot (1) tool-count assertions.
- `src/api-client.test.ts`: dropped `integrationToken`/`botToken` from config fixtures and the per-API-type auth-header assertions for integration/bot; added a `User-Agent: mcp-iva360` assertion; added auto-relogin-on-401 tests (relogin+retry, and no-retry with a static token).
- `src/mcp-protocol.test.ts`: `tools/list` expectation 40 → 28.

### Tests
- 58 tests pass (was 55; −2 removed integration/bot tool-count tests, +2 auto-relogin tests, +3 `enrichSessionDurations` tests).

---

## [1.5.4] — 2026-08-23

### Changed
- **Project rebrand: "MCP Server for IVA MCU" → "MCP Server for IVA 360".** All prose mentions of "IVA MCU" replaced with "IVA 360" across README (EN), `i18n/README.ru.md` (RU), server `instructions`, and `package.json` description. Example labels in MCP client configs, Docker tags, and codex names renamed `iva-mcu` → `iva-360` / `mcp/iva-mcu` → `mcp/iva-360`. e2e test assertion updated to expect "IVA 360".
- Note: the npm package name (`mcp-iva-mcu`), GitHub repo name, `bin`, `mcpName`, and install commands (`npm install`/`npx mcp-iva-mcu`) are unchanged — only display text and example labels were renamed.

---

## [1.5.3] — 2026-08-23

### Added
- **Security & significance badges** in README (EN) and `i18n/README.ru.md` (RU): tests (55), 0 dependencies vulnerabilities, no hardcoded secrets, TypeScript strict mode, MCP protocol, IVA 360 · Минцифры РФ platform.
- Fixed stale test count in README headers (53 → 55).

---

## [1.5.2] — 2026-08-23

### Fixed
- **Security: `rawBody` request body no longer leaks control/parameter fields to the IVA server.** In `createActionTool`, the `rawBody` branch previously only stripped `action` from the outgoing request body, so `confirm` and any `pathParams`/`queryParams` (e.g. `resourceId`) were forwarded to the upstream IVA API as unexpected body fields. The branch now strips `action`, `confirm`, and all declared path/query params before sending the body. Affects `iva_file_resources` (`upload`), `iva_conference_documents` (`create_directory`, `create_document`).
- `shutdown` handler in `src/index.ts` now logs shutdown errors instead of silently swallowing them.

### Added
- 2 regression tests in `src/tools/framework.test.ts` covering `rawBody` field stripping (55 tests total, was 53).
- **Documentation: subscription requirement.** README (EN) and `i18n/README.ru.md` (RU) now include a "Platform & Subscription" section stating that an active [iva360.ru](https://iva360.ru) subscription is required to use the server, and describing IVA 360 as a corporate communications platform for both large and small organizations. Prerequisites updated accordingly.
- Server `instructions` in `src/index.ts` and `package.json` description now mention the IVA 360 platform and subscription requirement.

---

## [1.4.4] — 2026-08-22

### Added
- **Chat name filling**: chats without a name now display participant names as a comma-separated list (like the official IVA client). Works for `get_all`, `search`, `get_p2p`, `get` actions.
- `transformResponse` callback support in `createActionTool` framework — allows post-processing API responses before returning to the AI agent

### Changed
- `iva_chat` tool now uses `fillChatNames` transformer to replace empty `name` field with participant names from `users` array

---

## [1.4.3] — 2026-08-22

### Added
- **35 new tests** (53 total): tool structure integrity (10 tests), parameter validation (12 tests), error formatting (9 tests), MCP protocol end-to-end (4 tests)
- `src/tools/index.test.ts` — verifies all 40 tools register correctly, have unique names, action enums, confirm parameter, correct tool counts (28+11+1)
- `src/tools/validate.test.ts` — UUID format, integer bounds, enum enforcement, type coercion, array validation, boolean, optional params
- `src/error.test.ts` — errorResult, apiErrorResult, successResult, IvaApiError constructor
- `src/mcp-protocol.test.ts` — end-to-end: initialize handshake, tools/list (40 tools), tools/call validation error, unknown tool error

---

## [1.4.2] — 2026-08-22

### Fixed
- Reverted forced protocol version override — SDK default negotiation is the correct approach (server responds with the highest version both client and server support)

---

## [1.4.1] — 2026-08-22

### Added
- Override initialize handler to always respond with latest protocol version `2025-11-25` (later reverted in 1.4.2)

---

## [1.4.0] — 2026-08-22

### Added
- **Destructive action confirmation**: `IVA_CONFIRM_DESTRUCTIVE=true` environment variable — when enabled, destructive actions (delete, remove, disconnect, stop, block, mute, cancel, reject, clear, pause) require an explicit `confirm: true` parameter before executing
- `confirm` parameter added to all tool schemas
- `isDestructiveAction` helper in framework — auto-detects destructive actions by method (DELETE) and action name keywords
- 3 new tests for confirm logic (blocked without confirm, allowed with confirm, allowed when disabled)
- Documentation for confirmation feature in README (EN + RU)

### Changed
- `IvaConfig` type extended with `confirmDestructive: boolean`
- `IvaApiClient` exposes `isConfirmDestructive()` method
- `loadConfig` reads `IVA_CONFIRM_DESTRUCTIVE` env var

---

## [1.3.3] — 2026-08-22

### Fixed
- **~50 bodyWrapper and query param corrections** across all tools, verified against OpenAPI specs:
  - Removed `bodyWrapper` from 8 actions where API expects raw array (contacts, interlocutors, chat-messages, integration conference-sessions)
  - Fixed `bodyWrapper` field names on 9 actions to match DTO schemas (user-session, conference-media, conference-chat, whiteboard, integration groups)
  - Fixed `contacts.invite` — changed from object body to raw array of profile UUIDs
  - Corrected query params on ~20 actions (chat search, chat-messages get, conference-session find, contacts get_changes, user-session get_login_url, conference-chat get, etc.)

---

## [1.3.2] — 2026-08-22

### Fixed
- **P2P chat parameter**: `get_p2p` was using `targetProfileId` but API expects `profileId` — direct messages now work correctly
- Added `contactId`, `email`, `phone`, `name` as optional query params for P2P chat lookup
- Updated server instructions: AI now guided to use `get_p2p` for direct messages, `create_group_chat` only for multi-user chats
- Clarified `messageData` description: field is `message` not `text`

---

## [1.3.1] — 2026-08-22

### Fixed
- **bodyWrapper corrections** for participant actions per OpenAPI specs:
  - `create_group_chat` (clients): removed bodyWrapper — API expects raw array
  - `chat-participants remove`: removed bodyWrapper — API expects raw array
  - `conference-participants add`: changed wrapper to `invitations` (was `participants`)
  - `conference-participants remove/disconnect`: removed bodyWrapper — API expects raw array
  - Integration `chats create_group_chat`: wrapper changed to `interlocutors`
  - Integration `chats add/remove_participants`: removed bodyWrapper
  - Integration `conferences add/remove_participants`: wrapper changed to `data`
  - Integration `conference-sessions add/remove_participants`: wrapper changed to `data`

---

## [1.3.0] — 2026-08-22

### Added
- **Natural language mapping**: server instructions now include full Russian/English keyword mapping for all 11+ categories (conferences, sessions, participants, chat, calls, profile, contacts, documents, whiteboard, screenshare, lobby, statistics, templates, system, integration API, bot API)
- **Action descriptions**: every action in all 40 tools now has a human-readable description with Russian and English keywords, helping AI agents map natural language requests to the correct tool and action
- **Capabilities section** in README (EN + RU) with full list of supported operations
- **Usage scenarios** in README (EN + RU): 7 real-world examples with natural language prompts
- **Security section** in README documenting excluded sensitive actions

### Changed
- `iva_user_session`: reduced from 10 to 5 actions — removed `login`, `login_with_token`, `login_exchange`, `2fa_renew`, `2fa_verify`
- `iva_profile`: reduced from 19 to 13 actions — removed `update_password`, `update_password_by_credentials`, `validate_password`, `get_password_recovery_info`, `request_password_recovery`, `update_password_by_recovery`
- Tool descriptions updated to note security exclusions
- Server instructions expanded from ~5 to 11+ categories with bilingual keywords

### Security
- Password management and recovery actions excluded from MCP tools
- Login and 2FA actions excluded — authentication handled automatically via `IVA_LOGIN`/`IVA_PASSWORD` environment variables
- AI agent never has access to user credentials

---

## [1.2.0] — 2026-08-21

### Added
- **Natural language mapping** in server instructions: Russian/English keywords mapped to tool + action (initial version, ~5 categories)
- **Action descriptions** for 6 key tools: `iva_conference`, `iva_conference_session`, `iva_conference_participants`, `iva_chat`, `iva_chat_messages`, `iva_profile`
- `actionDescriptions` parameter added to `createActionTool` framework

---

## [1.1.0] — 2026-08-21

### Added
- **Auto-login support**: `IVA_LOGIN` + `IVA_PASSWORD` environment variables — server automatically logs in and refreshes session tokens
- Session token caching in `IvaApiClient` — auto-login happens once, token is reused
- Test for auto-login flow in `api-client.test.ts`
- `IVA_LOGIN`/`IVA_PASSWORD` documented in README (EN + RU) as recommended authentication method

### Changed
- `buildAuthHeaders` is now async (supports auto-login)
- README examples updated to use `IVA_LOGIN`/`IVA_PASSWORD` instead of `IVA_SESSION_TOKEN`
- Server version bumped to 1.1.0

---

## [1.0.0] — 2026-08-21

### Added
- **40 MCP tools** covering IVA Clients API (v2.28.12), Integration API (v1.28.12), and Bot API (v1.28.12)
- **391 REST actions** across 368 API endpoints
- Data-driven tool framework (`createActionTool`) with action-based dispatch
- **DTO wrapping** (`bodyWrapper`) for primitive `bodyParam` values — ensures correct request body format for endpoints expecting wrapper objects
- **Parameter validation** via `ajv` + `ajv-formats`: UUID format validation, integer bounds, enum enforcement
- **HTTP timeout** (30 seconds) with `AbortController` — prevents hung requests
- **Graceful shutdown** on `SIGINT`/`SIGTERM` — properly closes MCP server and transport
- **URL validation** in `loadConfig` — validates `IVA_BASE_URL` is a proper `http:`/`https:` URL without credentials
- **Vitest tests**: 15 tests covering `config.ts`, `api-client.ts`, `framework.ts`
- Reusable JSON Schema parameter definitions in `params.ts`
- Centralized HTTP client with auto auth header injection per API type (Clients/Integration/Bot)
- Bilingual documentation: `README.md` (English) + `i18n/README.ru.md` (Russian)
- Docker multi-stage build on `node:22-alpine`
- `.dockerignore` for clean Docker builds
- Context7-style README with badges, navigation, tool tables, and MCP client configs
- npm package published at `mcp-iva-mcu`

### Removed
- WebSocket support entirely (`ws-client.ts`, `iva_events`, `iva_bot_events`) — eliminated security risk of tokens in query strings
- `ws` and `@types/ws` dependencies
- Unused `zod` dependency

### Security
- WebSocket authentication moved from query string (token exposure in logs) to complete removal of WebSocket functionality
- `.dockerignore` prevents leaking `node_modules`, `.git`, `dist` into Docker images