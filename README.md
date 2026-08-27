<div align="center">

# MCP Server for IVA 360

[![npm version](https://img.shields.io/npm/v/mcp-iva-mcu.svg)](https://www.npmjs.com/package/mcp-iva-mcu)
[![npm downloads](https://img.shields.io/npm/dm/mcp-iva-mcu.svg)](https://www.npmjs.com/package/mcp-iva-mcu)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![tests](https://img.shields.io/badge/tests-373-brightgreen.svg)](./CHANGELOG.md)
[![Node.js](https://img.shields.io/badge/Node.js-%E2%89%A520-green.svg)](https://nodejs.org/)
[![MCP protocol](https://img.shields.io/badge/protocol-MCP-purple.svg)](https://modelcontextprotocol.io)
[![platform](https://img.shields.io/badge/platform-IVA%20360%20%C2%B7%20%D0%9C%D0%B8%D0%BD%D1%86%D0%B8%D1%84%D1%80%D1%8B%20%D0%A0%D0%A4-blue.svg)](https://iva360.ru)

[![secrets](https://img.shields.io/badge/secrets-none%20hardcoded-brightgreen.svg)](#security)
[![malware](https://img.shields.io/badge/malware-none%20detected-brightgreen.svg)](#security)

**28 tools** · **304 REST actions** · **310 API endpoints** · **373 tests**

MCP server for the **IVA 360** video conferencing platform.
Wraps the IVA 360 Clients API (v2.28.12)
into 28 tools your AI agent can call directly.

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

## Platform & Subscription

This MCP server wraps the [**IVA 360**](https://iva360.ru) corporate video
conferencing Clients API.

**IVA 360** is a Russian-developed enterprise ecosystem that combines video
meetings, webinars, messenger, mail, cloud storage, and an AI assistant in a
single window. It is built for both **large and small organizations** — from
small teams on the Starter plan to holdings, educational institutions, and
government bodies on Enterprise (private/hybrid cloud with up to 99.98% SLA
and up to 10 million accounts). The software is registered in the Russian
Ministry of Digital Development registry and stores data on servers inside the
Russian Federation.

> ⚠️ **A subscription to [iva360.ru](https://iva360.ru) is required** to use this
> server. The IVA 360 API endpoints (`IVA_BASE_URL`) and the authentication
> tokens (`IVA_SESSION_TOKEN`, `IVA_JWT_TOKEN`, or `IVA_LOGIN`/`IVA_PASSWORD`)
> are only available to subscribed organizations. A free trial is available —
> see the website for plans and pricing.

➡️ More details: [iva360.ru](https://iva360.ru)

---

## Compatible API Versions

| API | Version | Base Path | Auth | Endpoints |
|-----|---------|-----------|------|-----------|
| IVA Clients API | **2.28.12** | `/api/rest` | `Session` header or JWT Bearer | 310 |

OpenAPI spec for this exact version is in [`specs/`](./specs) (source repo only).

## Installation

### Prerequisites

- Node.js 20+
- An active [IVA 360](https://iva360.ru) subscription (see [Platform & Subscription](#platform--subscription))
- IVA 360 server URL (e.g. `https://your-iva-server.ru`)
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
| `IVA_BASE_URL` | Yes | IVA 360 server URL |
| `IVA_LOGIN` | Clients API (auto-login) | Login (email) for automatic session refresh |
| `IVA_PASSWORD` | Clients API (auto-login) | Password for automatic session refresh |
| `IVA_SESSION_TOKEN` | Clients API (alternative) | Session UUID (expires — use login/password for auto-refresh) |
| `IVA_JWT_TOKEN` | Clients API (alternative) | JWT token |
| `IVA_CONFIRM_DESTRUCTIVE` | Optional | Set to `true` to require confirmation before destructive actions (delete, remove, stop, etc.) |
| `IVA_ALLOW_HTTP` | Optional | Set to `true` to allow an `http://` IVA_BASE_URL for local testing (otherwise only `https://` is accepted, since credentials would otherwise be sent in plaintext) |

For Clients API, you can either:
- Set `IVA_LOGIN` + `IVA_PASSWORD` — the server will auto-login and refresh sessions automatically (**recommended**), or
- Set `IVA_SESSION_TOKEN` directly — note that session tokens expire and must be refreshed manually.

### Destructive Action Confirmation

When `IVA_CONFIRM_DESTRUCTIVE=true` is set, the server requires an explicit `confirm: true` parameter before executing destructive actions (delete, remove, disconnect, stop, block, mute, cancel, reject, clear, pause). Without it, the tool returns a warning instead of executing, protecting against accidental data loss with AI agents. When unset or `false`, destructive actions execute without confirmation (default).

## MCP Client Configuration

### Claude Desktop

Add to `claude_desktop_config.json`:

**npx (recommended):**

```json
{
  "mcpServers": {
    "iva-360": {
      "command": "npx",
      "args": ["-y", "mcp-iva-mcu"],
      "env": {
        "IVA_BASE_URL": "https://your-iva-server.ru",
        "IVA_LOGIN": "your-email@example.ru",
        "IVA_PASSWORD": "your-password"
      }
    }
  }
}
```

**Windows** — use `cmd /c`:

```json
{
  "mcpServers": {
    "iva-360": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "mcp-iva-mcu"],
      "env": {
        "IVA_BASE_URL": "https://your-iva-server.ru",
        "IVA_LOGIN": "your-email@example.ru",
        "IVA_PASSWORD": "your-password"
      }
    }
  }
}
```

**Docker:**

```bash
docker build -t mcp/iva-360 .
```

```json
{
  "mcpServers": {
    "iva-360": {
      "command": "docker",
      "args": ["run", "--rm", "-i", "mcp/iva-360"],
      "env": {
        "IVA_BASE_URL": "https://your-iva-server.ru",
        "IVA_LOGIN": "your-email@example.ru",
        "IVA_PASSWORD": "your-password"
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
    "iva-360": {
      "command": "npx",
      "args": ["-y", "mcp-iva-mcu"],
      "env": {
        "IVA_BASE_URL": "https://your-iva-server.ru",
        "IVA_LOGIN": "your-email@example.ru",
        "IVA_PASSWORD": "your-password"
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
    "iva-360": {
      "command": "npx",
      "args": ["-y", "mcp-iva-mcu"],
      "env": {
        "IVA_BASE_URL": "https://your-iva-server.ru",
        "IVA_LOGIN": "your-email@example.ru",
        "IVA_PASSWORD": "your-password"
      }
    }
  }
}
```

### Codex CLI

```bash
codex mcp add iva-360 npx -y mcp-iva-mcu
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
    "iva-360": {
      "command": "node",
      "args": ["/absolute/path/to/mcp_iva_mcu/dist/index.js"],
      "env": {
        "IVA_BASE_URL": "https://your-iva-server.ru",
        "IVA_LOGIN": "your-email@example.ru",
        "IVA_PASSWORD": "your-password"
      }
    }
  }
}
```

## Tools Overview

### Clients API — 28 tools, 304 actions

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

## Capabilities

The MCP server understands **natural language in Russian and English**. You don't need to know tool names or action enums — just describe what you want in plain language, and the AI agent will map it to the correct tool and action.

### What you can do

- **Schedule and manage meetings** — create, update, delete conferences; start them instantly; list upcoming sessions
- **Control live conferences** — join/leave, start/stop recording, enable transcription and subtitling, manage media publication
- **Manage participants** — add, remove, mute/unmute, raise/lower hand, set reactions, send DTMF, disconnect
- **Chat** — create group chats, send and edit messages, forward, star, search, manage notifications. Chats without names display participant names automatically (like the official IVA client)
- **Make calls** — join/hold/transfer calls, start/stop screen sharing, send DTMF tones
- **Documents & presentations** — upload, convert, present documents and whiteboards, control demonstration
- **Lobby control** — approve or reject waiting participants
- **Statistics & reports** — view conference statistics, export attendance and participation data
- **Templates** — create and manage conference templates for quick scheduling
- **Contacts & presence** — search users, invite contacts, check who's online

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

### 6. Get conference statistics

> **You say:** "Покажи статистику по конференции 'Встреча' за прошлый месяц"

The AI agent will:
1. Find the session via `iva_conference_session`
2. Call `iva_conference_statistics` with `action: "get"` and date range
3. Return attendance, duration, and participation data

### 7. Analyze this week's meetings and time spent

> **You say:** "Сколько времени на этой неделе заняли встречи, в процентах от 40-часовой рабочей недели?"

The AI agent will:
1. Call `iva_conference_session` with `action: "find"`, `dateFrom` = Monday 00:00, `dateTo` = Sunday 23:59 (UNIX ms)
2. The response is enriched with `actualDurationMs` / `actualDuration` for each finished session (computed from `actualStartDate`/`actualEndDate`), so no manual math is needed
3. Sum `actualDurationMs` across sessions, divide by 40 h (40 × 3 600 000 ms), and report the percentage
4. Return per-meeting actual vs. planned duration and the total share of the work week

Example output: "11 meetings, 5 h 40 min actual (14.2% of a 40-hour week)."

> Note: call history (P2P calls in chats) is not exposed by the Clients API — only the live call state per chat (`iva_chat_call` `action: "get"`). So this analysis covers scheduled conferences only.

## Development

```bash
npm install          # Install dependencies
npm run build        # Compile TypeScript + chmod +x
npm run dev          # Watch mode
npm start            # Run server
docker build -t mcp/iva-360 .  # Docker image
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
│       ├── index.ts      # Tool registration (28 tools)
│       └── clients/      # 28 Clients API tools
├── specs/                # OpenAPI specifications
├── i18n/                 # Translations (README.ru.md)
├── Dockerfile            # Multi-stage Docker build
├── LICENSE
├── package.json
└── tsconfig.json
```

## License

[MIT](./LICENSE)

## Author

**Penzin Konstantin** — [GitHub](https://github.com/kostikpenzin) · [penzin85@gmail.com](mailto:penzin85@gmail.com)