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
      find_by_profile_ids: { apiType: "clients", method: "POST", path: "/interlocutors/profiles", bodyParam: "profileIds" },
      find: { apiType: "clients", method: "POST", path: "/interlocutors/find", bodyParam: "findCriteria" },
      get_types: { apiType: "clients", method: "GET", path: "/interlocutors/types" },
      subscribe_presence: { apiType: "clients", method: "POST", path: "/interlocutors/presences/subscribe", bodyParam: "profileIds" },
    },
    client,
  );
}