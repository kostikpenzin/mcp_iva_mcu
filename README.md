<div align="center">

# MCP Server for IVA MCU

[![npm version](https://img.shields.io/npm/v/mcp-iva-mcu.svg)](https://www.npmjs.com/package/mcp-iva-mcu)
[![npm downloads](https://img.shields.io/npm/dm/mcp-iva-mcu.svg)](https://www.npmjs.com/package/mcp-iva-mcu)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%E2%89%A518-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![GitHub stars](https://img.shields.io/github/stars/kostikpenzin/mcp_iva_mcu.svg)](https://github.com/kostikpenzin/mcp_iva_mcu)
[![GitHub issues](https://img.shields.io/github/issues/kostikpenzin/mcp_iva_mcu.svg)](https://github.com/kostikpenzin/mcp_iva_mcu/issues)

**40 tools** · **391 REST actions** · **368 API endpoints**

MCP server for the **IVA MCU** video conferencing platform.
Wraps Clients API (v2.28.12), Integration API (v1.28.12), and Bot API (v1.28.12)
into 40 tools your AI agent can call directly.

[Installation](#installation) ·
[Configuration](#mcp-client-configuration) ·
[Capabilities](#capabilities) ·
[Tools](#tools-overview) ·
[Scenarios](#usage-scenarios) ·
[Development](#development) ·
[npm package](https://www.npmjs.com/package/mcp-iva-mcu)

**Languages:** English · [Русский](./i18n/README.ru.md)

</div>

---

## Compatible API Versions

| API | Version | Base Path | Auth | Endpoints |
|-----|---------|-----------|------|-----------|
| IVA Clients API | **2.28.12** | `/api/rest` | `Session` header or JWT Bearer | 310 |
| IVA System Integration API | **1.28.12** | `/api/rest/integration` | Bearer token | 54 |
| IVA Chat Bot API | **1.28.12** | `/api/rest/bot` | `X-Iva-Bot-Api-Token` header | 4 |

OpenAPI specs for these exact versions are in [`specs/`](./specs) (source repo only).

## Installation

### Prerequisites

- Node.js 18+
- IVA MCU server URL (e.g. `https://your-iva-server.ru`)
- At least one auth token (see [Environment Variables](#environment-variables))

### Install from npm

```bash
npm install -g mcp-iva-mcu
# or run without installing
npx -y mcp-iva-mcu
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `IVA_BASE_URL` | Yes | IVA MCU server URL |
| `IVA_LOGIN` | Clients API (auto-login) | Login (email) for automatic session refresh |
| `IVA_PASSWORD` | Clients API (auto-login) | Password for automatic session refresh |
| `IVA_SESSION_TOKEN` | Clients API (alternative) | Session UUID (expires — use login/password for auto-refresh) |
| `IVA_JWT_TOKEN` | Clients API (alternative) | JWT token |
| `IVA_INTEGRATION_TOKEN` | Integration API | Bearer token |
| `IVA_BOT_TOKEN` | Bot API | Bot API token |
| `IVA_CONFIRM_DESTRUCTIVE` | Optional | Set to `true` to require confirmation before destructive actions (delete, remove, stop, etc.) |

For Clients API, you can either:
- Set `IVA_LOGIN` + `IVA_PASSWORD` — the server will auto-login and refresh sessions automatically (**recommended**), or
- Set `IVA_SESSION_TOKEN` directly — note that session tokens expire and must be refreshed manually.

### Destructive Action Confirmation

When `IVA_CONFIRM_DESTRUCTIVE=true` is set, the server requires an explicit `confirm: true` parameter before executing destructive actions (delete, remove, disconnect, stop, block, mute, cancel, reject, clear, pause). Without confirmation, the tool returns a warning message instead of executing.

This protects against accidental data loss when using AI agents.

**Without confirmation (blocked):**
```
Tool: iva_conference
Arguments:
  action: "delete"
  conferenceId: "abc-123"
→ Returns: "⚠️ Confirmation required..."
```

**With confirmation (executed):**
```
Tool: iva_conference
Arguments:
  action: "delete"
  conferenceId: "abc-123"
  confirm: true
→ Executes the deletion
```

When `IVA_CONFIRM_DESTRUCTIVE` is not set or `false`, destructive actions execute without confirmation (default behavior).

## MCP Client Configuration

### Claude Desktop

Add to `claude_desktop_config.json`:

**npx (recommended):**

```json
{
  "mcpServers": {
    "iva-mcu": {
      "command": "npx",
      "args": ["-y", "mcp-iva-mcu"],
      "env": {
        "IVA_BASE_URL": "https://your-iva-server.ru",
        "IVA_LOGIN": "your-email@example.ru",
        "IVA_PASSWORD": "your-password",
        "IVA_CONFIRM_DESTRUCTIVE": "true",
        "IVA_INTEGRATION_TOKEN": "your-integration-token",
        "IVA_BOT_TOKEN": "your-bot-token"
      }
    }
  }
}
```

**Windows** — use `cmd /c`:

```json
{
  "mcpServers": {
    "iva-mcu": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "mcp-iva-mcu"],
      "env": {
        "IVA_BASE_URL": "https://your-iva-server.ru",
        "IVA_LOGIN": "your-email@example.ru",
        "IVA_PASSWORD": "your-password",
        "IVA_CONFIRM_DESTRUCTIVE": "true",
        "IVA_INTEGRATION_TOKEN": "your-integration-token",
        "IVA_BOT_TOKEN": "your-bot-token"
      }
    }
  }
}
```

**Docker:**

```bash
docker build -t mcp/iva-mcu .
```

```json
{
  "mcpServers": {
    "iva-mcu": {
      "command": "docker",
      "args": ["run", "--rm", "-i", "mcp/iva-mcu"],
      "env": {
        "IVA_BASE_URL": "https://your-iva-server.ru",
        "IVA_LOGIN": "your-email@example.ru",
        "IVA_PASSWORD": "your-password",
        "IVA_CONFIRM_DESTRUCTIVE": "true",
        "IVA_INTEGRATION_TOKEN": "your-integration-token",
        "IVA_BOT_TOKEN": "your-bot-token"
      }
    }
  }
}
```

### Cursor

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "iva-mcu": {
      "command": "npx",
      "args": ["-y", "mcp-iva-mcu"],
      "env": {
        "IVA_BASE_URL": "https://your-iva-server.ru",
        "IVA_LOGIN": "your-email@example.ru",
        "IVA_PASSWORD": "your-password",
        "IVA_CONFIRM_DESTRUCTIVE": "true"
      }
    }
  }
}
```

### VS Code

Add to `.vscode/mcp.json`:

```json
{
  "servers": {
    "iva-mcu": {
      "command": "npx",
      "args": ["-y", "mcp-iva-mcu"],
      "env": {
        "IVA_BASE_URL": "https://your-iva-server.ru",
        "IVA_LOGIN": "your-email@example.ru",
        "IVA_PASSWORD": "your-password",
        "IVA_CONFIRM_DESTRUCTIVE": "true"
      }
    }
  }
}
```

### Codex CLI

```bash
codex mcp add iva-mcu npx -y mcp-iva-mcu
```

### From source

```bash
git clone https://github.com/kostikpenzin/mcp_iva_mcu.git
cd mcp_iva_mcu
npm install
npm run build
```

```json
{
  "mcpServers": {
    "iva-mcu": {
      "command": "node",
      "args": ["/absolute/path/to/mcp_iva_mcu/dist/index.js"],
      "env": {
        "IVA_BASE_URL": "https://your-iva-server.ru",
        "IVA_LOGIN": "your-email@example.ru",
        "IVA_PASSWORD": "your-password",
        "IVA_CONFIRM_DESTRUCTIVE": "true"
      }
    }
  }
}
```

## Tools Overview

### Clients API — 28 tools, 317 actions

| Tool | Description | Actions |
|------|-------------|---------|
| `iva_user_session` | Logout, session info, guest login, session state | 5 |
| `iva_profile` | Profile, call forwarding, disk, subscriptions | 13 |
| `iva_contacts` | Contacts, invitations, presences, tags | 12 |
| `iva_interlocutors` | Find interlocutors, presence subscription | 7 |
| `iva_devices` | Register/deregister devices | 2 |
| `iva_documents` | Convert, delete, list pages | 4 |
| `iva_file_resources` | Create, upload, download, scan status | 5 |
| `iva_system` | System info, media, ICE servers, layouts | 10 |
| `iva_chat` | Chat CRUD, search, forward, notifications | 13 |
| `iva_chat_participants` | Add, remove, update participants | 3 |
| `iva_chat_messages` | Send, edit, delete, star, attachments | 14 |
| `iva_chat_call` | Join/leave/hold, record, screenshare, transfer, DTMF | 16 |
| `iva_conference` | Conference CRUD, schedule, rooms, invitations | 12 |
| `iva_conference_session` | Session lifecycle, recording, transcription, media | 35 |
| `iva_conference_session_groups` | Create/activate/deactivate/move/remove groups | 7 |
| `iva_conference_media` | Media info, layout, profile, language, attention | 12 |
| `iva_conference_participants` | Add/remove/mute/hand/reaction/DTMF/callback | 23 |
| `iva_conference_lobby` | Join/leave, approve/reject | 7 |
| `iva_conference_documents` | Documents, directories, demonstration control | 19 |
| `iva_conference_inquiry` | Polls: CRUD, answers, start/stop, export | 16 |
| `iva_conference_chat` | Conference chat: send/edit/moderate/export | 10 |
| `iva_conference_questionnaire` | Get questionnaire, save answers | 2 |
| `iva_conference_presence_control` | Start/stop/confirm presence control | 3 |
| `iva_conference_self_registration` | Register, check/resend email | 3 |
| `iva_conference_statistics` | Statistics, exports, aggregation (v1 + v2) | 17 |
| `iva_conference_templates` | Template CRUD, set default | 6 |
| `iva_whiteboard` | Books, pages, demonstration, export, undo | 21 |
| `iva_screenshare` | Web/VNC screen share, remote control | 7 |

### Integration API — 11 tools, 70 actions

| Tool | Description | Actions |
|------|-------------|---------|
| `iva_integration_users` | User CRUD, block/unblock, paid calls, login | 12 |
| `iva_integration_companies` | Company CRUD, block/unblock, disk, paid calls | 11 |
| `iva_integration_groups` | Group CRUD, subgroups, user management | 8 |
| `iva_integration_conferences` | Conference CRUD, participants, templates | 7 |
| `iva_integration_conference_sessions` | Session CRUD, rooms, participants, documents | 11 |
| `iva_integration_chats` | Chat CRUD, participants, calls, documents | 11 |
| `iva_integration_documents` | Disk files, delete documents | 3 |
| `iva_integration_domains` | Get domain info | 2 |
| `iva_integration_subscriptions` | Subscription CRUD | 5 |
| `iva_integration_profiles` | Get profile info | 1 |
| `iva_integration_resources` | Download file | 1 |

### Bot API — 1 tool, 4 actions

| Tool | Description | Actions |
|------|-------------|---------|
| `iva_bot_chat` | Send message, create resource, upload/download files | 4 |

## Capabilities

The MCP server understands **natural language in Russian and English**. You don't need to know tool names or action enums — just describe what you want in plain language, and the AI agent will map it to the correct tool and action.

### What you can do

- **Schedule and manage meetings** — create, update, delete conferences; start them instantly; list upcoming sessions
- **Control live conferences** — join/leave, start/stop recording, enable transcription and subtitling, manage media publication
- **Manage participants** — add, remove, mute/unmute, raise/lower hand, set reactions, send DTMF, disconnect
- **Chat** — create group chats, send and edit messages, forward, star, search, manage notifications
- **Make calls** — join/hold/transfer calls, start/stop screen sharing, send DTMF tones
- **Documents & presentations** — upload, convert, present documents and whiteboards, control demonstration
- **Lobby control** — approve or reject waiting participants
- **Statistics & reports** — view conference statistics, export attendance and participation data
- **Templates** — create and manage conference templates for quick scheduling
- **Contacts & presence** — search users, invite contacts, check who's online
- **User management (Integration API)** — create/block/unblock users, manage companies and groups
- **Bot messaging** — send messages and files on behalf of a bot

### Security

- Password management and recovery actions are **excluded** from the MCP tools
- Login and 2FA actions are **excluded** — authentication is handled automatically via `IVA_LOGIN`/`IVA_PASSWORD` environment variables
- The AI agent never sees or handles your credentials directly

## Usage Scenarios

### 1. Book a meeting

> **You say:** "Заброни встречу на завтра в 10 утра, название 'Планёрка отдела'"

The AI agent will:
1. Call `iva_conference` with `action: "create"`
2. Generate `conferenceData` with `name: "Планёрка отдела"` and `startDate` as tomorrow's 10:00 AM in UNIX milliseconds
3. Return the conference ID and number

### 2. List upcoming meetings

> **You say:** "Покажи все встречи на этой неделе"

The AI agent will:
1. Call `iva_conference_session` with `action: "find"`
2. Set `dateFrom` to Monday and `dateTo` to Sunday
3. Return a list of sessions with names, dates, and states

### 3. Start recording in a live conference

> **You say:** "Начни запись в конференции 'Встреча'"

The AI agent will:
1. Call `iva_conference_session` with `action: "find"` to locate the session
2. Call `iva_conference_session` with `action: "start_recording"` using the session ID
3. Confirm recording has started

### 4. Mute a participant

> **You say:** "Выключи микрофон у Иванова в текущей конференции"

The AI agent will:
1. Find the active session and list participants via `iva_conference_participants`
2. Identify the participant by name
3. Call `iva_conference_participants` with `action: "mute_media"` targeting that participant

### 5. Send a message to a chat

> **You say:** "Отправь сообщение в чат 'Разработка': 'Релиз сегодня в 18:00'"

The AI agent will:
1. Search chats via `iva_chat` with `action: "search"`
2. Call `iva_chat_messages` with `action: "send"` and the message text

### 6. Create a new user (Integration API)

> **You say:** "Создай пользователя ivan@company.ru в компании 'АО ИВА360'"

The AI agent will:
1. Find the company via `iva_integration_companies`
2. Call `iva_integration_users` with `action: "create"` and user data

### 7. Get conference statistics

> **You say:** "Покажи статистику по конференции 'Встреча' за прошлый месяц"

The AI agent will:
1. Find the session via `iva_conference_session`
2. Call `iva_conference_statistics` with `action: "get"` and date range
3. Return attendance, duration, and participation data

## Development

```bash
npm install          # Install dependencies
npm run build        # Compile TypeScript + chmod +x
npm run dev          # Watch mode
npm start            # Run server
docker build -t mcp/iva-mcu .  # Docker image
npm publish          # Publish to npm (auto clean + build)
```

## Project Structure

```
mcp_iva_mcu/
├── src/
│   ├── index.ts          # MCP server entry point
│   ├── config.ts         # Environment configuration
│   ├── api-client.ts     # HTTP client with auth
│   ├── error.ts          # Error handling
│   ├── types.ts          # Shared types
│   └── tools/
│       ├── framework.ts  # Data-driven tool framework
│       ├── params.ts     # Reusable param schemas
│       ├── index.ts      # Tool registration (40 tools)
│       ├── clients/      # 28 Clients API tools
│       ├── integration/  # 11 Integration API tools
│       └── bot/          # 1 Bot API tool
├── specs/                # OpenAPI specifications
├── i18n/                 # Translations (README.ru.md)
├── Dockerfile            # Multi-stage Docker build
├── LICENSE
├── package.json
└── tsconfig.json
```

## License

[MIT](./LICENSE)