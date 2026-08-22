<div align="center">

# MCP-сервер для IVA MCU

[![npm version](https://img.shields.io/npm/v/mcp-iva-mcu.svg)](https://www.npmjs.com/package/mcp-iva-mcu)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](../LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%E2%89%A518-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![GitHub stars](https://img.shields.io/github/stars/kostikpenzin/mcp_iva_mcu.svg)](https://github.com/kostikpenzin/mcp_iva_mcu)
[![GitHub issues](https://img.shields.io/github/issues/kostikpenzin/mcp_iva_mcu.svg)](https://github.com/kostikpenzin/mcp_iva_mcu/issues)

**40 инструментов** · **375 REST-действий** · **368 эндпоинтов** · **53 теста**

MCP-сервер для видеоконференцплатформы **IVA MCU**.
Оборачивает Clients API (v2.28.12), Integration API (v1.28.12) и Bot API (v1.28.12)
в 40 инструментов, которые ваш AI-агент может вызывать напрямую.

[Установка](#установка) ·
[Конфигурация](#конфигурация-mcp-клиентов) ·
[Возможности](#возможности) ·
[Инструменты](#обзор-инструментов) ·
[Сценарии](#сценарии-использования) ·
[Разработка](#разработка) ·
[npm-пакет](https://www.npmjs.com/package/mcp-iva-mcu)

**Языки:** [English](../README.md) · Русский

</div>

---

## Платформа и подписка

Этот MCP-сервер подключается к **IVA MCU** — видеоконференц-ядру
корпоративной платформы [**IVA 360**](https://iva360.ru).

**IVA 360** — российская корпоративная экосистема, объединяющая видеовстречи,
вебинары, мессенджер, почту, облачный диск и ИИ-ассистента в одном окне.
Решение рассчитано как на **крупный, так и на малый бизнес** — от небольших
команд на тарифе «Стартовый» до холдингов, образовательных учреждений и
государственных организаций на Enterprise (частное/гибридное облако, SLA до
99,98%, до 10 млн учётных записей). ПО включено в реестр Минцифры РФ, данные
хранятся на серверах внутри Российской Федерации.

> ⚠️ **Для работы сервера требуется подписка [iva360.ru](https://iva360.ru).**
> Эндпоинты IVA MCU API (`IVA_BASE_URL`) и токены аутентификации
> (`IVA_SESSION_TOKEN`, `IVA_JWT_TOKEN`, `IVA_INTEGRATION_TOKEN`,
> `IVA_BOT_TOKEN` или `IVA_LOGIN`/`IVA_PASSWORD`) доступны только организациям
> с активной подпиской. Доступен бесплатный пробный период — тарифы и условия
> см. на сайте.

➡️ Подробнее: [iva360.ru](https://iva360.ru)

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
- Активная подписка [IVA 360](https://iva360.ru) (см. [Платформа и подписка](#платформа-и-подписка))
- URL сервера IVA MCU (например, `https://your-iva-server.ru`)
- Хотя бы один токен аутентификации (см. [Переменные окружения](#переменные-окружения))

### Установка из npm

```bash
npm install -g mcp-iva-mcu
# или запуск без установки
npx -y mcp-iva-mcu
```

### Переменные окружения

| Переменная | Обязательна | Описание |
|-----------|------------|----------|
| `IVA_BASE_URL` | Да | URL сервера IVA MCU |
| `IVA_LOGIN` | Clients API (авто-логин) | Логин (email) для автоматического обновления сессии |
| `IVA_PASSWORD` | Clients API (авто-логин) | Пароль для автоматического обновления сессии |
| `IVA_SESSION_TOKEN` | Clients API (альтернатива) | UUID сессии (истекает — используйте login/password для автообновления) |
| `IVA_JWT_TOKEN` | Clients API (альтернатива) | JWT-токен |
| `IVA_INTEGRATION_TOKEN` | Integration API | Bearer-токен |
| `IVA_BOT_TOKEN` | Bot API | Токен Bot API |
| `IVA_CONFIRM_DESTRUCTIVE` | Опционально | Установите `true` для обязательного подтверждения деструктивных действий (удаление, остановка и т.д.) |

Для Clients API можно либо:
- Указать `IVA_LOGIN` + `IVA_PASSWORD` — сервер автоматически залогинится и будет обновлять сессию (**рекомендуется**), либо
- Указать `IVA_SESSION_TOKEN` напрямую — учтите, что session-токены истекают и их нужно обновлять вручную.

### Подтверждение деструктивных действий

Когда `IVA_CONFIRM_DESTRUCTIVE=true`, сервер требует явный параметр `confirm: true` перед выполнением деструктивных действий (удаление, удаление участника, отключение, остановка, блокировка, мьют, отмена, отклонение, очистка, пауза). Без подтверждения инструмент возвращает предупреждение вместо выполнения.

Это защищает от случайной потери данных при работе с AI-агентами.

**Без подтверждения (заблокировано):**
```
Инструмент: iva_conference
Аргументы:
  action: "delete"
  conferenceId: "abc-123"
→ Возвращает: "⚠️ Требуется подтверждение..."
```

**С подтверждением (выполнено):**
```
Инструмент: iva_conference
Аргументы:
  action: "delete"
  conferenceId: "abc-123"
  confirm: true
→ Выполняет удаление
```

Когда `IVA_CONFIRM_DESTRUCTIVE` не задан или `false`, деструктивные действия выполняются без подтверждения (поведение по умолчанию).

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
        "IVA_LOGIN": "your-email@example.ru",
        "IVA_PASSWORD": "your-password",
        "IVA_CONFIRM_DESTRUCTIVE": "true",
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
        "IVA_LOGIN": "your-email@example.ru",
        "IVA_PASSWORD": "your-password",
        "IVA_CONFIRM_DESTRUCTIVE": "true",
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
        "IVA_LOGIN": "your-email@example.ru",
        "IVA_PASSWORD": "your-password",
        "IVA_CONFIRM_DESTRUCTIVE": "true",
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
        "IVA_LOGIN": "your-email@example.ru",
        "IVA_PASSWORD": "your-password",
        "IVA_CONFIRM_DESTRUCTIVE": "true"
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
        "IVA_LOGIN": "your-email@example.ru",
        "IVA_PASSWORD": "your-password",
        "IVA_CONFIRM_DESTRUCTIVE": "true"
      }
    }
  }
}
```

## Обзор инструментов

### Clients API — 28 инструментов, 317 действий

| Инструмент | Описание | Действий |
|-----------|----------|---------|
| `iva_user_session` | Выход, информация о сессии, гостевой вход, состояние | 5 |
| `iva_profile` | Профиль, переадресация, диск, подписки | 13 |
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

## Возможности

MCP-сервер понимает **естественный язык на русском и английском**. Не нужно знать названия инструментов или enum-действий — просто опишите, что нужно сделать, и AI-агент сопоставит это с нужным инструментом и действием.

### Что можно делать

- **Планировать и управлять встречами** — создавать, обновлять, удалять конференции; запускать мгновенно; просматривать предстоящие сессии
- **Управлять живыми конференциями** — входить/выходить, начинать/останавливать запись, включать транскрипцию и субтитры, управлять медиа-публикацией
- **Управлять участниками** — добавлять, удалять, мьютить/размьютить, поднимать/опускать руку, ставить реакции, отправлять DTMF, отключать
- **Общаться в чате** — создавать групповые чаты, отправлять и редактировать сообщения, пересылать, отмечать, искать, управлять уведомлениями. Чаты без названия автоматически показывают имена участников (как в официальном клиенте IVA)
- **Совершать звонки** — входить/удерживать/переводить звонки, начинать/останавливать демонстрацию экрана, отправлять DTMF
- **Документы и презентации** — загружать, конвертировать, демонстрировать документы и интерактивную доску, управлять показом
- **Управление залом ожидания** — одобрять или отклонять ожидающих участников
- **Статистика и отчёты** — просматривать статистику конференций, экспортировать данные о посещаемости и участии
- **Шаблоны** — создавать и управлять шаблонами конференций для быстрого планирования
- **Контакты и присутствие** — искать пользователей, приглашать контакты, проверять, кто онлайн
- **Управление пользователями (Integration API)** — создавать/блокировать/разблокировать пользователей, управлять компаниями и группами
- **Сообщения от бота** — отправлять сообщения и файлы от имени бота

### Безопасность

- Действия по управлению паролями и восстановлению **исключены** из MCP-инструментов
- Действия входа и 2FA **исключены** — аутентификация выполняется автоматически через переменные окружения `IVA_LOGIN`/`IVA_PASSWORD`
- AI-агент никогда не видит и не обрабатывает ваши учётные данные напрямую

## Сценарии использования

### 1. Забронировать встречу

> **Вы говорите:** "Заброни встречу на завтра в 10 утра, название 'Планёрка отдела'"

AI-агент:
1. Вызовет `iva_conference` с `action: "create"`
2. Сформирует `conferenceData` с `name: "Планёрка отдела"` и `startDate` — завтра 10:00 в UNIX-миллисекундах
3. Вернёт ID и номер конференции

### 2. Показать предстоящие встречи

> **Вы говорите:** "Покажи все встречи на этой неделе"

AI-агент:
1. Вызовет `iva_conference_session` с `action: "find"`
2. Установит `dateFrom` — понедельник, `dateTo` — воскресенье
3. Вернёт список сессий с названиями, датами и статусами

### 3. Начать запись в конференции

> **Вы говорите:** "Начни запись в конференции 'Встреча'"

AI-агент:
1. Найдёт сессию через `iva_conference_session` с `action: "find"`
2. Вызовет `iva_conference_session` с `action: "start_recording"` и ID сессии
3. Подтвердит, что запись началась

### 4. Выключить микрофон участнику

> **Вы говорите:** "Выключи микрофон у Иванова в текущей конференции"

AI-агент:
1. Найдёт активную сессию и список участников через `iva_conference_participants`
2. Определит участника по имени
3. Вызовет `iva_conference_participants` с `action: "mute_media"` для этого участника

### 5. Отправить сообщение в чат

> **Вы говорите:** "Отправь сообщение в чат 'Разработка': 'Релиз сегодня в 18:00'"

AI-агент:
1. Найдёт чат через `iva_chat` с `action: "search"`
2. Вызовет `iva_chat_messages` с `action: "send"` и текстом сообщения

### 6. Создать пользователя (Integration API)

> **Вы говорите:** "Создай пользователя ivan@company.ru в компании 'АО ИВА360'"

AI-агент:
1. Найдёт компанию через `iva_integration_companies`
2. Вызовет `iva_integration_users` с `action: "create"` и данными пользователя

### 7. Получить статистику по конференции

> **Вы говорите:** "Покажи статистику по конференции 'Встреча' за прошлый месяц"

AI-агент:
1. Найдёт сессию через `iva_conference_session`
2. Вызовет `iva_conference_statistics` с `action: "get"` и диапазоном дат
3. Вернёт данные о посещаемости, длительности и участии

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