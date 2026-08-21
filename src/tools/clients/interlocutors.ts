import type { IvaApiClient } from "../../api-client.js";
import type { ToolDefinition } from "../../types.js";
import { createActionTool } from "../framework.js";
import { P } from "../params.js";

export function createInterlocutorsTool(client: IvaApiClient): ToolDefinition {
  return createActionTool(
    "iva_interlocutors",
    "IVA interlocutors: find by contact/ldap/profile/profileIds, find interlocutors, get available types, subscribe to presence. Clients API v2.28.12.",
    [
      "find_by_contact", "find_by_ldap_user", "find_by_profile",
      "find_by_profile_ids", "find", "get_types", "subscribe_presence",
    ],
    {
      contactId: P.contactId,
      userId: { type: "string", description: "LDAP user ID" },
      profileId: P.profileId,
      profileIds: P.profileIds,
      findCriteria: { type: "object", description: "Find criteria for interlocutor search" },
    },
    {
      find_by_contact: { apiType: "clients", method: "GET", path: "/interlocutors/contact/{contactId}", pathParams: ["contactId"] },
      find_by_ldap_user: { apiType: "clients", method: "GET", path: "/interlocutors/ldap/{userId}", pathParams: ["userId"] },
      find_by_profile: { apiType: "clients", method: "GET", path: "/interlocutors/profile/{profileId}", pathParams: ["profileId"] },
      find_by_profile_ids: { apiType: "clients", method: "POST", path: "/interlocutors/profiles", bodyParam: "profileIds", bodyWrapper: "profileIds" },
      find: { apiType: "clients", method: "POST", path: "/interlocutors/find", bodyParam: "findCriteria" },
      get_types: { apiType: "clients", method: "GET", path: "/interlocutors/types" },
      subscribe_presence: { apiType: "clients", method: "POST", path: "/interlocutors/presences/subscribe", bodyParam: "profileIds", bodyWrapper: "profileIds" },
    },
    client,
    {
      find_by_contact: "Find an interlocutor (contact) by contact ID. Найти собеседника по ID контакта.",
      find_by_ldap_user: "Find an interlocutor by LDAP user ID (corporate directory lookup).",
      find_by_profile: "Find an interlocutor by IVA profile ID.",
      find_by_profile_ids: "Find multiple interlocutors by a list of profile IDs (batch lookup).",
      find: "Search for interlocutors using flexible criteria (name, department, etc.). Найти собеседников по критериям поиска.",
      get_types: "Get the list of available interlocutor types (user/group/room/etc.).",
      subscribe_presence: "Subscribe to presence/status changes for one or more profiles. Подписаться на присутствие.",
    },
  );
}