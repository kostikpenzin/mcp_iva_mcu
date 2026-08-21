# Changelog

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