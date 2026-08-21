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
[Tools](#tools-overview) ·
[Usage](#usage-examples) ·
[Development](#development)

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

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `IVA_BASE_URL` | Yes | IVA MCU server URL |
| `IVA_SESSION_TOKEN` | Clients API | Session UUID |
| `IVA_JWT_TOKEN` | Clients API | JWT token (alternative to session) |
| `IVA_INTEGRATION_TOKEN` | Integration API | Bearer token |
| `IVA_BOT_TOKEN` | Bot API | Bot API token |

Set at least one token per API you want to use.

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
        "IVA_SESSION_TOKEN": "your-session-uuid",
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
        "IVA_SESSION_TOKEN": "your-session-uuid",
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
        "IVA_SESSION_TOKEN": "your-session-uuid",
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
        "IVA_SESSION_TOKEN": "your-session-uuid"
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
        "IVA_SESSION_TOKEN": "your-session-uuid"
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
        "IVA_SESSION_TOKEN": "your-session-uuid"
      }
    }
  }
}
```

## Tools Overview

### Clients API — 28 tools, 317 actions

| Tool | Description | Actions |
|------|-------------|---------|
| `iva_user_session` | Login, logout, 2FA, session management | 10 |
| `iva_profile` | Profile, call forwarding, password, disk, subscriptions | 19 |
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

## Usage Examples

Each tool uses an `action` parameter (string enum) to select the operation.

**Create a conference:**
```
Tool: iva_conference
Arguments:
  action: "create"
  conferenceData: { "name": "Team Meeting", "type": "PERIODICAL" }
```

**Send a chat message:**
```
Tool: iva_chat_messages
Arguments:
  action: "send"
  chatRoomId: "abc-123-def-456"
  messageData: { "text": "Hello everyone!" }
```

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