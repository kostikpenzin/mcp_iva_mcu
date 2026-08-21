<div align="center">

# MCP-сервер для IVA MCU

[![npm version](https://img.shields.io/npm/v/mcp-iva-mcu.svg)](https://www.npmjs.com/package/mcp-iva-mcu)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](../LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%E2%89%A518-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![GitHub stars](https://img.shields.io/github/stars/kostikpenzin/mcp_iva_mcu.svg)](https://github.com/kostikpenzin/mcp_iva_mcu)
[![GitHub issues](https://img.shields.io/github/issues/kostikpenzin/mcp_iva_mcu.svg)](https://github.com/kostikpenzin/mcp_iva_mcu/issues)

**40 инструментов** · **391 REST-действие** · **368 эндпоинтов**

MCP-сервер для видеоконференцплатформы **IVA MCU**.
Оборачивает Clients API (v2.28.12), Integration API (v1.28.12) и Bot API (v1.28.12)
в 40 инструментов, которые ваш AI-агент может вызывать напрямую.

[Установка](#установка) ·
[Конфигурация](#конфигурация-mcp-клиентов) ·
[Инструменты](#обзор-инструментов) ·
[Примеры](#примеры-использования) ·
[Разработка](#разработка)

**Языки:** [English](../README.md) · Русский

</div>

---

## Совместимые версии API

| API | Версия | Базовый путь | Аутентификация | Эндпоинтов |
|-----|--------|-------------|----------------|------------|
| IVA Clients API | **2.28.12** | `/api/rest` | Заголовок `Session` или JWT Bearer | 310 |
| IVA System Integration API | **1.28.12** | `/api/rest/integration` | Bearer-токен | 54 |
| IVA Chat Bot API | **1.28.12** | `/api/rest/bot` | Заголовок `X-Iva-Bot-Api-Token` | 4 |

OpenAPI-спецификации для этих версий — в каталоге [`specs/`](../specs) (только в репозитории).

## Установка

### Требования

- Node.js 18+
- URL сервера IVA MCU (например, `https://your-iva-server.ru`)
- Хотя бы один токен аутентификации (см. [Переменные окружения](#переменные-окружения))

### Переменные окружения

| Переменная | Обязательна | Описание |
|-----------|------------|----------|
| `IVA_BASE_URL` | Да | URL сервера IVA MCU |
| `IVA_SESSION_TOKEN` | Clients API | UUID сессии |
| `IVA_JWT_TOKEN` | Clients API | JWT-токен (альтернатива сессии) |
| `IVA_INTEGRATION_TOKEN` | Integration API | Bearer-токен |
| `IVA_BOT_TOKEN` | Bot API | Токен Bot API |

Укажите хотя бы один токен для каждого API, который планируете использовать.

## Конфигурация MCP-клиентов

### Claude Desktop

Добавьте в `claude_desktop_config.json`:

**npx (рекомендуется):**

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

**Windows** — используйте `cmd /c`:

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
        "IVA_SESSION_TOKEN": "ваш-session-uuid",
        "IVA_INTEGRATION_TOKEN": "ваш-integration-токен",
        "IVA_BOT_TOKEN": "ваш-bot-токен"
      }
    }
  }
}
```

### Cursor

Добавьте в `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "iva-mcu": {
      "command": "npx",
      "args": ["-y", "mcp-iva-mcu"],
      "env": {
        "IVA_BASE_URL": "https://your-iva-server.ru",
        "IVA_SESSION_TOKEN": "ваш-session-uuid"
      }
    }
  }
}
```

### VS Code

Добавьте в `.vscode/mcp.json`:

```json
{
  "servers": {
    "iva-mcu": {
      "command": "npx",
      "args": ["-y", "mcp-iva-mcu"],
      "env": {
        "IVA_BASE_URL": "https://your-iva-server.ru",
        "IVA_SESSION_TOKEN": "ваш-session-uuid"
      }
    }
  }
}
```

### Codex CLI

```bash
codex mcp add iva-mcu npx -y mcp-iva-mcu
```

### Из исходников

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
      "args": ["/абсолютный/путь/к/mcp_iva_mcu/dist/index.js"],
      "env": {
        "IVA_BASE_URL": "https://your-iva-server.ru",
        "IVA_SESSION_TOKEN": "ваш-session-uuid"
      }
    }
  }
}
```

## Обзор инструментов

### Clients API — 28 инструментов, 317 действий

| Инструмент | Описание | Действий |
|-----------|----------|---------|
| `iva_user_session` | Вход, выход, 2FA, управление сессией | 10 |
| `iva_profile` | Профиль, переадресация, пароль, диск, подписки | 19 |
| `iva_contacts` | Контакты, приглашения, присутствие, теги | 12 |
| `iva_interlocutors` | Поиск собеседников, подписка на присутствие | 7 |
| `iva_devices` | Регистрация/отмена регистрации устройств | 2 |
| `iva_documents` | Конвертация, удаление, страницы | 4 |
| `iva_file_resources` | Создание, загрузка, скачивание, статус сканирования | 5 |
| `iva_system` | Системная информация, медиа, ICE, раскладки | 10 |
| `iva_chat` | CRUD чатов, поиск, пересылка, уведомления | 13 |
| `iva_chat_participants` | Добавление, удаление, обновление участников | 3 |
| `iva_chat_messages` | Отправка, редактирование, удаление, отметка, вложения | 14 |
| `iva_chat_call` | Вход/выход/удержание, запись, экран, перевод, DTMF | 16 |
| `iva_conference` | CRUD конференций, расписание, комнаты, приглашения | 12 |
| `iva_conference_session` | Жизненный цикл, запись, транскрипция, медиа | 35 |
| `iva_conference_session_groups` | Создание/активация/перемещение/удаление групп | 7 |
| `iva_conference_media` | Медиа-инфо, раскладка, профиль, язык, внимание | 12 |
| `iva_conference_participants` | Добавление/удаление/мьют/рука/реакция/DTMF | 23 |
| `iva_conference_lobby` | Вход/выход, одобрение/отклонение | 7 |
| `iva_conference_documents` | Документы, директории, демонстрация | 19 |
| `iva_conference_inquiry` | Опросы: CRUD, ответы, запуск/остановка, экспорт | 16 |
| `iva_conference_chat` | Чат конференции: отправка/редактирование/модерация | 10 |
| `iva_conference_questionnaire` | Анкета, сохранение ответов | 2 |
| `iva_conference_presence_control` | Контроль присутствия: запуск/остановка/подтверждение | 3 |
| `iva_conference_self_registration` | Регистрация, проверка/отправка email | 3 |
| `iva_conference_statistics` | Статистика, экспорт, агрегация (v1 + v2) | 17 |
| `iva_conference_templates` | CRUD шаблонов, установка по умолчанию | 6 |
| `iva_whiteboard` | Книги, страницы, демонстрация, экспорт, отмена | 21 |
| `iva_screenshare` | Демонстрация экрана Web/VNC, удалённое управление | 7 |

### Integration API — 11 инструментов, 70 действий

| Инструмент | Описание | Действий |
|-----------|----------|---------|
| `iva_integration_users` | CRUD пользователей, блокировка, платные звонки | 12 |
| `iva_integration_companies` | CRUD компаний, блокировка, диск, платные звонки | 11 |
| `iva_integration_groups` | CRUD групп, подгруппы, управление пользователями | 8 |
| `iva_integration_conferences` | CRUD конференций, участники, шаблоны | 7 |
| `iva_integration_conference_sessions` | CRUD сессий, комнаты, участники, документы | 11 |
| `iva_integration_chats` | CRUD чатов, участники, звонки, документы | 11 |
| `iva_integration_documents` | Файлы диска, удаление документов | 3 |
| `iva_integration_domains` | Информация о домене | 2 |
| `iva_integration_subscriptions` | CRUD подписок | 5 |
| `iva_integration_profiles` | Информация о профиле | 1 |
| `iva_integration_resources` | Скачивание файла | 1 |

### Bot API — 1 инструмент, 4 действия

| Инструмент | Описание | Действий |
|-----------|----------|---------|
| `iva_bot_chat` | Отправка сообщений, создание/загрузка/скачивание файлов | 4 |

## Примеры использования

Каждый инструмент принимает параметр `action` (строковый enum) для выбора операции.

**Создание конференции:**
```
Инструмент: iva_conference
Аргументы:
  action: "create"
  conferenceData: { "name": "Совещание команды", "type": "PERIODICAL" }
```

**Отправка сообщения:**
```
Инструмент: iva_chat_messages
Аргументы:
  action: "send"
  chatRoomId: "abc-123-def-456"
  messageData: { "text": "Всем привет!" }
```

## Разработка

```bash
npm install          # Установка зависимостей
npm run build        # Компиляция TypeScript + chmod +x
npm run dev          # Режим наблюдения
npm start            # Запуск сервера
docker build -t mcp/iva-mcu .  # Docker-образ
npm publish          # Публикация в npm (авто clean + build)
```

## Структура проекта

```
mcp_iva_mcu/
├── src/
│   ├── index.ts          # Точка входа MCP-сервера
│   ├── config.ts         # Конфигурация окружения
│   ├── api-client.ts     # HTTP-клиент с авторизацией
│   ├── error.ts          # Обработка ошибок
│   ├── types.ts          # Общие типы
│   └── tools/
│       ├── framework.ts  # Data-driven фреймворк
│       ├── params.ts     # Переиспользуемые параметры
│       ├── index.ts      # Регистрация (40 инструментов)
│       ├── clients/      # 28 инструментов Clients API
│       ├── integration/  # 11 инструментов Integration API
│       └── bot/          # 1 инструмент Bot API
├── specs/                # OpenAPI-спецификации
├── i18n/                 # Переводы (README.ru.md)
├── Dockerfile            # Многоэтапная сборка Docker
├── LICENSE
├── package.json
└── tsconfig.json
```

## Лицензия

[MIT](../LICENSE)