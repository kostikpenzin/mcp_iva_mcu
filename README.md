# MCP Server for IVA MCU

**Languages:** [English](#english) | [Русский](#русский)

---

<a id="english"></a>

# English

MCP (Model Context Protocol) server for the **IVA MCU** video conferencing platform. Provides **42 tools** covering **391 REST actions** across **368 API endpoints** in three IVA APIs, plus 17 WebSocket event channels.

## Compatible API Versions

| API | Version | Base URL Path | Auth Method | Endpoints |
|-----|---------|---------------|------------|-----------|
| **IVA Clients API** | **2.28.12** | `/api/rest` | `Session` header (UUID) or JWT Bearer | 310 |
| **IVA System Integration API** | **1.28.12** | `/api/rest/integration` | Bearer token | 54 |
| **IVA Chat Bot API** | **1.28.12** | `/api/rest/bot` | `X-Iva-Bot-Api-Token` header | 4 |

OpenAPI specifications for these exact versions are in the `specs/` directory of the source repository (not included in the npm package):
- `specs/clients-openapi.json` — IVA Clients API v2.28.12
- `specs/integration-openapi.json` — IVA System Integration API v1.28.12
- `specs/bot-openapi.json` — IVA Chat Bot API v1.28.12

Original documentation: see the IVA MCU REST API, Integration API, and Bot API docs for your server version.

## Installation

### Prerequisites

- Node.js 18 or later
- IVA MCU server accessible (e.g. `https://your-iva-server.ru`)
- At least one auth token (see [Environment Variables](#environment-variables))

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `IVA_BASE_URL` | Yes | Base URL of the IVA MCU server (e.g. `https://your-iva-server.ru`) |
| `IVA_SESSION_TOKEN` | For Clients API | Session UUID for Clients API authentication |
| `IVA_JWT_TOKEN` | For Clients API | JWT token (alternative to session token) |
| `IVA_INTEGRATION_TOKEN` | For Integration API | Bearer token for server-to-server integration |
| `IVA_BOT_TOKEN` | For Bot API | Bot API token (`X-Iva-Bot-Api-Token` header) |

You need at least one auth token depending on which APIs you want to use. For example, to use all three APIs, set all four tokens.

### Usage with Claude Desktop

Add this to your `claude_desktop_config.json`:

**Using npx (recommended):**

```json
{
  "mcpServers": {
    "iva-mcu": {
      "command": "npx",
      "args": ["-y", "mcp-iva-mcu"],
      "env": {
        "IVA_BASE_URL": "https://your-iva-server.ru",
        "IVA_SESSION_TOKEN": "your-session-uuid-here",
        "IVA_INTEGRATION_TOKEN": "your-integration-bearer-token",
        "IVA_BOT_TOKEN": "your-bot-api-token"
      }
    }
  }
}
```

**On Windows** use `cmd /c` to launch npx:

```json
{
  "mcpServers": {
    "iva-mcu": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "mcp-iva-mcu"],
      "env": {
        "IVA_BASE_URL": "https://your-iva-server.ru",
        "IVA_SESSION_TOKEN": "your-session-uuid-here",
        "IVA_INTEGRATION_TOKEN": "your-integration-bearer-token",
        "IVA_BOT_TOKEN": "your-bot-api-token"
      }
    }
  }
}
```

**Using Docker:**

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
        "IVA_SESSION_TOKEN": "your-session-uuid-here",
        "IVA_INTEGRATION_TOKEN": "your-integration-bearer-token",
        "IVA_BOT_TOKEN": "your-bot-api-token"
      }
    }
  }
}
```

### Usage with VS Code

Add this to your user-level MCP configuration or workspace `.vscode/mcp.json`:

```json
{
  "servers": {
    "iva-mcu": {
      "command": "npx",
      "args": ["-y", "mcp-iva-mcu"],
      "env": {
        "IVA_BASE_URL": "https://your-iva-server.ru",
        "IVA_SESSION_TOKEN": "your-session-uuid-here",
        "IVA_INTEGRATION_TOKEN": "your-integration-bearer-token",
        "IVA_BOT_TOKEN": "your-bot-api-token"
      }
    }
  }
}
```

### Usage with Codex CLI

```bash
codex mcp add iva-mcu npx -y mcp-iva-mcu
```

### Build from source

```bash
git clone <repo-url>
cd mcp_iva_mcu
npm install
npm run build
```

Then use the local build:

```json
{
  "mcpServers": {
    "iva-mcu": {
      "command": "node",
      "args": ["/absolute/path/to/mcp_iva_mcu/dist/index.js"],
      "env": {
        "IVA_BASE_URL": "https://your-iva-server.ru",
        "IVA_SESSION_TOKEN": "your-session-uuid-here",
        "IVA_INTEGRATION_TOKEN": "your-integration-bearer-token",
        "IVA_BOT_TOKEN": "your-bot-api-token"
      }
    }
  }
}
```

## Tools Overview

### Clients API Tools (28 tools, 315 actions)

| Tool | Description | Actions |
|------|-------------|---------|
| `iva_user_session` | Login, logout, 2FA, session management | 10 |
| `iva_profile` | Profile CRUD, call forwarding, password, disk, subscriptions, user files | 19 |
| `iva_contacts` | Contacts, invitations, presences, tags | 12 |
| `iva_interlocutors` | Find interlocutors by contact/ldap/profile, presence | 7 |
| `iva_devices` | Register/deregister user devices | 2 |
| `iva_documents` | Convert, delete, list document pages | 4 |
| `iva_file_resources` | Create, upload, download resources, scanning status | 5 |
| `iva_system` | System info, media info, ICE servers, layouts, applications | 10 |
| `iva_chat` | Chat CRUD, search, forward, notifications | 13 |
| `iva_chat_participants` | Add, remove, update chat participants | 3 |
| `iva_chat_messages` | Send, edit, delete, star messages, attachments | 14 |
| `iva_chat_call` | Join/leave/hold, recording, screenshare, transfer, DTMF | 16 |
| `iva_conference` | Conference CRUD, schedule, rooms, invitations | 12 |
| `iva_conference_session` | Session lifecycle, recording, transcription, media publication | 35 |
| `iva_conference_session_groups` | Create/activate/deactivate/move/remove groups | 7 |
| `iva_conference_media` | Media info, layout, profile, language, attention | 12 |
| `iva_conference_participants` | Add/remove/mute/hand/reaction/DTMF/callback | 23 |
| `iva_conference_lobby` | Join/leave, approve/reject participants | 7 |
| `iva_conference_documents` | Documents, directories, demonstration control | 19 |
| `iva_conference_inquiry` | Inquiries/polls: CRUD, answers, start/stop, export | 16 |
| `iva_conference_chat` | Conference chat messages: send/edit/moderate/export | 10 |
| `iva_conference_questionnaire` | Get questionnaire, save answers | 2 |
| `iva_conference_presence_control` | Start/stop/confirm presence control | 3 |
| `iva_conference_self_registration` | Register, check/resend email | 3 |
| `iva_conference_statistics` | Session/participant statistics, exports, aggregation (v1 + v2) | 17 |
| `iva_conference_templates` | Template CRUD, set as default | 6 |
| `iva_whiteboard` | Books, pages, demonstration, export, undo | 21 |
| `iva_screenshare` | Web/VNC screen share, remote control | 7 |

### Integration API Tools (11 tools, 72 actions)

| Tool | Description | Actions |
|------|-------------|---------|
| `iva_integration_users` | User CRUD, block/unblock, paid calls, login | 12 |
| `iva_integration_companies` | Company CRUD, block/unblock, disk, paid calls | 11 |
| `iva_integration_groups` | Group CRUD, subgroups, user management | 8 |
| `iva_integration_conferences` | Conference CRUD, participants, templates | 7 |
| `iva_integration_conference_sessions` | Session CRUD, rooms, participants, documents | 11 |
| `iva_integration_chats` | Chat CRUD, participants, calls, call documents | 11 |
| `iva_integration_documents` | Disk files, delete documents | 3 |
| `iva_integration_domains` | Get domain info | 2 |
| `iva_integration_subscriptions` | Subscription CRUD | 5 |
| `iva_integration_profiles` | Get profile info | 1 |
| `iva_integration_resources` | Download file | 1 |

### Bot API Tools (2 tools, 4 actions)

| Tool | Description | Actions |
|------|-------------|---------|
| `iva_bot_chat` | Send message, create/upload/download files | 4 |
| `iva_bot_events` | Collect chat events via WebSocket | — |

### Events Tool (1 tool, 17 WebSocket channels)

| Tool | Description |
|------|-------------|
| `iva_events` | Collect events from WebSocket channels (chat, conference, active conference, contact, group, profile, system) |

## Usage Pattern

Each tool uses an `action` parameter (string enum) to select the specific operation. Other parameters are optional in the schema but validated at runtime.

Example — creating a conference:

```
Tool: iva_conference
Arguments:
  action: "create"
  conferenceData: {
    "name": "Team Meeting",
    "type": "PERIODICAL",
    ...
  }
```

Example — sending a chat message:

```
Tool: iva_chat_messages
Arguments:
  action: "send"
  chatRoomId: "abc-123-def-456"
  messageData: {
    "text": "Hello everyone!"
  }
```

Example — collecting events:

```
Tool: iva_events
Arguments:
  event_type: "chat"
  duration: 15
```

## Development

```bash
# Install dependencies
npm install

# Build (compiles TypeScript + makes output executable)
npm run build

# Watch mode for development
npm run dev

# Start server directly
npm start

# Build Docker image
docker build -t mcp/iva-mcu .

# Clean build artifacts
npm run clean

# Publish to npm (runs clean + build automatically)
npm publish
```

## Project Structure

```
mcp_iva_mcu/
├── src/
│   ├── index.ts              # MCP server entry point (shebang, stdio transport)
│   ├── config.ts             # Environment variable configuration
│   ├── api-client.ts         # HTTP client with auth header injection
│   ├── ws-client.ts          # WebSocket client for event collection
│   ├── error.ts              # Error handling and result formatting
│   ├── types.ts              # Shared TypeScript types
│   └── tools/
│       ├── framework.ts      # Data-driven tool creation framework
│       ├── params.ts         # Reusable parameter schema definitions
│       ├── index.ts          # Tool registration (42 tools)
│       ├── clients/          # 28 Clients API tool files
│       ├── integration/      # 11 Integration API tool files
│       ├── bot/              # 2 Bot API tool files
│       └── events.ts         # WebSocket events tool
├── specs/                    # OpenAPI specifications (source repo only)
│   ├── clients-openapi.json  # IVA Clients API v2.28.12
│   ├── integration-openapi.json  # IVA Integration API v1.28.12
│   └── bot-openapi.json      # IVA Bot API v1.28.12
├── Dockerfile                # Multi-stage Docker build (node:22-alpine)
├── .npmignore                # Excludes src/, specs/, node_modules from npm
├── package.json             # npm package config (bin, files, scripts)
├── tsconfig.json             # TypeScript compiler config
└── README.md
```

## npm Package

Published as [`mcp-iva-mcu`](https://www.npmjs.com/package/mcp-iva-mcu) on npm.

- **Package size**: 24 KB (only compiled `dist/` + `README.md`)
- **Bin command**: `mcp-iva-mcu`
- **Auto-build**: `prepare` script runs `npm run build` on install from git
- **Executable**: `shx chmod +x dist/*.js` ensures Unix executability

## License

MIT

---

<a id="русский"></a>

# Русский

MCP-сервер (Model Context Protocol) для видеоконференцплатформы **IVA MCU**. Предоставляет **42 инструмента**, покрывающих **391 REST-действие** на **368 эндпоинтах** трёх API IVA, плюс 17 WebSocket-каналов событий.

## Совместимые версии API

| API | Версия | Базовый путь | Метод аутентификации | Эндпоинтов |
|-----|--------|-------------|----------------------|------------|
| **IVA Clients API** | **2.28.12** | `/api/rest` | Заголовок `Session` (UUID) или JWT Bearer | 310 |
| **IVA System Integration API** | **1.28.12** | `/api/rest/integration` | Bearer-токен | 54 |
| **IVA Chat Bot API** | **1.28.12** | `/api/rest/bot` | Заголовок `X-Iva-Bot-Api-Token` | 4 |

OpenAPI-спецификации для этих версий находятся в каталоге `specs/` исходного репозитория (не включаются в npm-пакет):
- `specs/clients-openapi.json` — IVA Clients API v2.28.12
- `specs/integration-openapi.json` — IVA System Integration API v1.28.12
- `specs/bot-openapi.json` — IVA Chat Bot API v1.28.12

Оригинальная документация: см. документацию REST API, Integration API и Bot API для вашей версии сервера IVA MCU.

## Установка

### Требования

- Node.js 18 или новее
- Доступный сервер IVA MCU (например, `https://your-iva-server.ru`)
- Хотя бы один токен аутентификации (см. [Переменные окружения](#переменные-окружения))

### Переменные окружения

| Переменная | Обязательна | Описание |
|-----------|------------|----------|
| `IVA_BASE_URL` | Да | Базовый URL сервера IVA MCU (например, `https://your-iva-server.ru`) |
| `IVA_SESSION_TOKEN` | Для Clients API | UUID сессии для аутентификации в Clients API |
| `IVA_JWT_TOKEN` | Для Clients API | JWT-токен (альтернатива сессионному токену) |
| `IVA_INTEGRATION_TOKEN` | Для Integration API | Bearer-токен для server-to-server интеграции |
| `IVA_BOT_TOKEN` | Для Bot API | Токен Bot API (заголовок `X-Iva-Bot-Api-Token`) |

Нужен хотя бы один токен в зависимости от того, какие API вы планируете использовать. Для работы со всеми тремя API укажите все четыре токена.

### Использование с Claude Desktop

Добавьте в файл `claude_desktop_config.json`:

**Через npx (рекомендуется):**

```json
{
  "mcpServers": {
    "iva-mcu": {
      "command": "npx",
      "args": ["-y", "mcp-iva-mcu"],
      "env": {
        "IVA_BASE_URL": "https://your-iva-server.ru",
        "IVA_SESSION_TOKEN": "ваш-session-uuid",
        "IVA_INTEGRATION_TOKEN": "ваш-integration-токен",
        "IVA_BOT_TOKEN": "ваш-bot-токен"
      }
    }
  }
}
```

**На Windows** используйте `cmd /c` для запуска npx:

```json
{
  "mcpServers": {
    "iva-mcu": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "mcp-iva-mcu"],
      "env": {
        "IVA_BASE_URL": "https://your-iva-server.ru",
        "IVA_SESSION_TOKEN": "ваш-session-uuid",
        "IVA_INTEGRATION_TOKEN": "ваш-integration-токен",
        "IVA_BOT_TOKEN": "ваш-bot-токен"
      }
    }
  }
}
```

**Через Docker:**

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
        "IVA_SESSION_TOKEN": "ваш-session-uuid",
        "IVA_INTEGRATION_TOKEN": "ваш-integration-токен",
        "IVA_BOT_TOKEN": "ваш-bot-токен"
      }
    }
  }
}
```

### Использование с VS Code

Добавьте в пользовательскую MCP-конфигурацию или в файл `.vscode/mcp.json` в рабочей области:

```json
{
  "servers": {
    "iva-mcu": {
      "command": "npx",
      "args": ["-y", "mcp-iva-mcu"],
      "env": {
        "IVA_BASE_URL": "https://your-iva-server.ru",
        "IVA_SESSION_TOKEN": "ваш-session-uuid",
        "IVA_INTEGRATION_TOKEN": "ваш-integration-токен",
        "IVA_BOT_TOKEN": "ваш-bot-токен"
      }
    }
  }
}
```

### Использование с Codex CLI

```bash
codex mcp add iva-mcu npx -y mcp-iva-mcu
```

### Сборка из исходников

```bash
git clone <url-репозитория>
cd mcp_iva_mcu
npm install
npm run build
```

Затем используйте локальную сборку:

```json
{
  "mcpServers": {
    "iva-mcu": {
      "command": "node",
      "args": ["/абсолютный/путь/к/mcp_iva_mcu/dist/index.js"],
      "env": {
        "IVA_BASE_URL": "https://your-iva-server.ru",
        "IVA_SESSION_TOKEN": "ваш-session-uuid",
        "IVA_INTEGRATION_TOKEN": "ваш-integration-токен",
        "IVA_BOT_TOKEN": "ваш-bot-токен"
      }
    }
  }
}
```

## Обзор инструментов

### Инструменты Clients API (28 инструментов, 315 действий)

| Инструмент | Описание | Действий |
|-----------|----------|---------|
| `iva_user_session` | Вход, выход, 2FA, управление сессией | 10 |
| `iva_profile` | CRUD профиля, переадресация вызовов, пароль, диск, подписки, файлы | 19 |
| `iva_contacts` | Контакты, приглашения, статусы присутствия, теги | 12 |
| `iva_interlocutors` | Поиск собеседников по контакту/LDAP/профилю, присутствие | 7 |
| `iva_devices` | Регистрация/отмена регистрации устройств | 2 |
| `iva_documents` | Конвертация, удаление, страницы документов | 4 |
| `iva_file_resources` | Создание, загрузка, скачивание ресурсов, статус сканирования | 5 |
| `iva_system` | Системная информация, медиа, ICE-серверы, раскладки, приложения | 10 |
| `iva_chat` | CRUD чатов, поиск, пересылка, уведомления | 13 |
| `iva_chat_participants` | Добавление, удаление, обновление участников чата | 3 |
| `iva_chat_messages` | Отправка, редактирование, удаление, отметка сообщений, вложения | 14 |
| `iva_chat_call` | Вход/выход/удержание, запись, демонстрация экрана, перевод, DTMF | 16 |
| `iva_conference` | CRUD конференций, расписание, комнаты, приглашения | 12 |
| `iva_conference_session` | Жизненный цикл сессии, запись, транскрипция, медиа-публикация | 35 |
| `iva_conference_session_groups` | Создание/активация/деактивация/перемещение/удаление групп | 7 |
| `iva_conference_media` | Медиа-инфо, раскладка, профиль, язык, внимание | 12 |
| `iva_conference_participants` | Добавление/удаление/мьют/рука/реакция/DTMF/обратный вызов | 23 |
| `iva_conference_lobby` | Вход/выход, одобрение/отклонение участников | 7 |
| `iva_conference_documents` | Документы, директории, управление демонстрацией | 19 |
| `iva_conference_inquiry` | Опросы: CRUD, ответы, запуск/остановка, экспорт | 16 |
| `iva_conference_chat` | Сообщения чата конференции: отправка/редактирование/модерация/экспорт | 10 |
| `iva_conference_questionnaire` | Получение анкеты, сохранение ответов | 2 |
| `iva_conference_presence_control` | Запуск/остановка/подтверждение контроля присутствия | 3 |
| `iva_conference_self_registration` | Регистрация, проверка/отправка email | 3 |
| `iva_conference_statistics` | Статистика сессий/участников, экспорт, агрегация (v1 + v2) | 17 |
| `iva_conference_templates` | CRUD шаблонов, установка по умолчанию | 6 |
| `iva_whiteboard` | Книги, страницы, демонстрация, экспорт, отмена | 21 |
| `iva_screenshare` | Демонстрация экрана Web/VNC, удалённое управление | 7 |

### Инструменты Integration API (11 инструментов, 72 действия)

| Инструмент | Описание | Действий |
|-----------|----------|---------|
| `iva_integration_users` | CRUD пользователей, блокировка, платные звонки, вход | 12 |
| `iva_integration_companies` | CRUD компаний, блокировка, диск, платные звонки | 11 |
| `iva_integration_groups` | CRUD групп, подгруппы, управление пользователями | 8 |
| `iva_integration_conferences` | CRUD конференций, участники, шаблоны | 7 |
| `iva_integration_conference_sessions` | CRUD сессий, комнаты, участники, документы | 11 |
| `iva_integration_chats` | CRUD чатов, участники, звонки, документы звонков | 11 |
| `iva_integration_documents` | Файлы диска, удаление документов | 3 |
| `iva_integration_domains` | Получение информации о домене | 2 |
| `iva_integration_subscriptions` | CRUD подписок | 5 |
| `iva_integration_profiles` | Получение информации о профиле | 1 |
| `iva_integration_resources` | Скачивание файла | 1 |

### Инструменты Bot API (2 инструмента, 4 действия)

| Инструмент | Описание | Действий |
|-----------|----------|---------|
| `iva_bot_chat` | Отправка сообщений, создание/загрузка/скачивание файлов | 4 |
| `iva_bot_events` | Сбор событий чата через WebSocket | — |

### Инструмент событий (1 инструмент, 17 WebSocket-каналов)

| Инструмент | Описание |
|-----------|----------|
| `iva_events` | Сбор событий из WebSocket-каналов (чат, конференция, активная конференция, контакт, группа, профиль, система) |

## Паттерн использования

Каждый инструмент принимает параметр `action` (строковый enum) для выбора конкретной операции. Остальные параметры опциональны в схеме, но валидируются во время выполнения.

Пример — создание конференции:

```
Инструмент: iva_conference
Аргументы:
  action: "create"
  conferenceData: {
    "name": "Совещание команды",
    "type": "PERIODICAL",
    ...
  }
```

Пример — отправка сообщения в чат:

```
Инструмент: iva_chat_messages
Аргументы:
  action: "send"
  chatRoomId: "abc-123-def-456"
  messageData: {
    "text": "Всем привет!"
  }
```

Пример — сбор событий:

```
Инструмент: iva_events
Аргументы:
  event_type: "chat"
  duration: 15
```

## Разработка

```bash
# Установка зависимостей
npm install

# Сборка (компиляция TypeScript + установка исполняемого бита)
npm run build

# Режим наблюдения для разработки
npm run dev

# Прямой запуск сервера
npm start

# Сборка Docker-образа
docker build -t mcp/iva-mcu .

# Очистка артефактов сборки
npm run clean

# Публикация в npm (автоматически: clean + build)
npm publish
```

## Структура проекта

```
mcp_iva_mcu/
├── src/
│   ├── index.ts              # Точка входа MCP-сервера (shebang, stdio-транспорт)
│   ├── config.ts             # Конфигурация через переменные окружения
│   ├── api-client.ts         # HTTP-клиент с подстановкой auth-заголовков
│   ├── ws-client.ts          # WebSocket-клиент для сбора событий
│   ├── error.ts              # Обработка ошибок и форматирование результатов
│   ├── types.ts              # Общие типы TypeScript
│   └── tools/
│       ├── framework.ts      # Data-driven фреймворк создания инструментов
│       ├── params.ts         # Переиспользуемые определения параметров
│       ├── index.ts          # Регистрация инструментов (42 инструмента)
│       ├── clients/          # 28 файлов инструментов Clients API
│       ├── integration/      # 11 файлов инструментов Integration API
│       ├── bot/              # 2 файла инструментов Bot API
│       └── events.ts         # Инструмент WebSocket-событий
├── specs/                    # OpenAPI-спецификации (только в репозитории)
│   ├── clients-openapi.json  # IVA Clients API v2.28.12
│   ├── integration-openapi.json  # IVA Integration API v1.28.12
│   └── bot-openapi.json      # IVA Bot API v1.28.12
├── Dockerfile                # Многоэтапная сборка Docker (node:22-alpine)
├── .npmignore                # Исключает src/, specs/, node_modules из npm
├── package.json             # Конфигурация npm-пакета (bin, files, scripts)
├── tsconfig.json             # Конфигурация компилятора TypeScript
└── README.md
```

## npm-пакет

Публикуется как [`mcp-iva-mcu`](https://www.npmjs.com/package/mcp-iva-mcu) в npm.

- **Размер пакета**: 24 КБ (только скомпилированные `dist/` + `README.md`)
- **Команда**: `mcp-iva-mcu`
- **Автосборка**: скрипт `prepare` запускает `npm run build` при установке из git
- **Исполняемость**: `shx chmod +x dist/*.js` обеспечивает исполняемость на Unix

## Лицензия

MIT