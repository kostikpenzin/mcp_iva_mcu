# Changelog

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