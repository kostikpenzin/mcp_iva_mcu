import type { IvaApiClient } from "../../api-client.js";
import type { ToolDefinition } from "../../types.js";
import { createActionTool } from "../framework.js";
import { P } from "../params.js";

export function createContactsTool(client: IvaApiClient): ToolDefinition {
  return createActionTool(
    "iva_contacts",
    "IVA contacts management: get/search contacts, changes, presences, invitations, tags, invite, reject, remove, update, create note. Clients API v2.28.12.",
    [
      "get", "get_changes", "get_presences", "get_invitations",
      "get_tags", "get_users_presence", "invite", "reject_invitation",
      "remove", "update", "remove_contacts", "create_note",
    ],
    {
      id: P.id,
      contactIds: P.contactIds,
      contactData: { type: "object", description: "Contact data for update" },
      inviteData: { type: "object", description: "Invitation data" },
      presenceUserIds: { type: "array", items: { type: "string" }, description: "Profile IDs to get presences for" },
      noteData: { type: "object", description: "Note contact data" },
      limit: P.limit,
      offset: P.offset,
      dateFrom: P.dateFrom,
      dateTo: P.dateTo,
    },
    {
      get: { apiType: "clients", method: "GET", path: "/contacts", queryParams: ["limit", "offset"] },
      get_changes: { apiType: "clients", method: "GET", path: "/contacts/changes", queryParams: ["dateFrom", "dateTo", "limit", "offset"] },
      get_presences: { apiType: "clients", method: "GET", path: "/contacts/presences" },
      get_invitations: { apiType: "clients", method: "GET", path: "/contacts/invitations" },
      get_tags: { apiType: "clients", method: "GET", path: "/contacts/tags" },
      get_users_presence: { apiType: "clients", method: "POST", path: "/contacts/presences/find-for-users", bodyParam: "presenceUserIds", bodyWrapper: "presenceUserIds" },
      invite: { apiType: "clients", method: "POST", path: "/contacts/invite", bodyParam: "inviteData" },
      reject_invitation: { apiType: "clients", method: "POST", path: "/contacts/invitations/reject", bodyParam: "contactIds", bodyWrapper: "contactIds" },
      remove: { apiType: "clients", method: "DELETE", path: "/contacts/{id}", pathParams: ["id"] },
      update: { apiType: "clients", method: "PATCH", path: "/contacts/{id}", pathParams: ["id"], bodyParam: "contactData" },
      remove_contacts: { apiType: "clients", method: "POST", path: "/contacts/remove", bodyParam: "contactIds", bodyWrapper: "contactIds" },
      create_note: { apiType: "clients", method: "POST", path: "/contacts/create-note", bodyParam: "noteData" },
    },
    client,
    {
      get: "Получить список контактов. / Get the list of contacts.",
      get_changes: "Получить изменения контактов. / Get contacts changes.",
      get_presences: "Получить статусы присутствия контактов. / Get contacts presences.",
      get_invitations: "Получить входящие приглашения в контакты. / Get incoming contact invitations.",
      get_tags: "Получить теги контактов. / Get contact tags.",
      get_users_presence: "Получить статусы присутствия пользователей. / Get users presences.",
      invite: "Пригласить пользователя в контакты. / Invite a user to contacts.",
      reject_invitation: "Отклонить приглашение в контакты. / Reject a contact invitation.",
      remove: "Удалить контакт. / Remove a contact.",
      update: "Обновить данные контакта. / Update contact data.",
      remove_contacts: "Удалить несколько контактов. / Remove multiple contacts.",
      create_note: "Создать заметку о контакте. / Create a contact note.",
    },
  );
}