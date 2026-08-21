import type { IvaApiClient } from "../../api-client.js";
import type { ToolDefinition } from "../../types.js";
import { createActionTool } from "../framework.js";
import { P } from "../params.js";

export function createIntegrationGroupsTool(client: IvaApiClient): ToolDefinition {
  return createActionTool(
    "iva_integration_groups",
    "IVA Integration API — group management: get top level/subgroups, create/get/update/delete groups, add/remove users. Integration API v1.28.12.",
    ["get_top_level", "create", "get", "update", "delete", "get_subgroups", "add_users", "remove_users"],
    {
      groupId: P.groupId,
      parentGroupId: { type: "string", description: "Parent group UUID" },
      groupData: { type: "object", description: "Group creation/update data" },
      userIds: P.userIds,
    },
    {
      get_top_level: { apiType: "integration", method: "GET", path: "/groups" },
      create: { apiType: "integration", method: "POST", path: "/groups", bodyParam: "groupData" },
      get: { apiType: "integration", method: "GET", path: "/groups/{groupId}", pathParams: ["groupId"] },
      update: { apiType: "integration", method: "PATCH", path: "/groups/{groupId}", pathParams: ["groupId"], bodyParam: "groupData" },
      delete: { apiType: "integration", method: "DELETE", path: "/groups/{groupId}", pathParams: ["groupId"] },
      get_subgroups: { apiType: "integration", method: "GET", path: "/groups/{parentGroupId}/subgroups", pathParams: ["parentGroupId"] },
      add_users: { apiType: "integration", method: "POST", path: "/groups/{groupId}/users/add", pathParams: ["groupId"], bodyParam: "userIds", bodyWrapper: "userIds" },
      remove_users: { apiType: "integration", method: "POST", path: "/groups/{groupId}/users/remove", pathParams: ["groupId"], bodyParam: "userIds", bodyWrapper: "userIds" },
    },
    client,
    {
      get_top_level: "Получить группы верхнего уровня / Get top-level groups.",
      create: "Создать новую группу / Create a new group.",
      get: "Получить информацию о группе / Get group information by groupId.",
      update: "Обновить данные группы / Update an existing group's information.",
      delete: "Удалить группу / Delete a group.",
      get_subgroups: "Получить подгруппы / Get subgroups of a parent group.",
      add_users: "Добавить пользователей в группу / Add users to a group.",
      remove_users: "Удалить пользователей из группы / Remove users from a group.",
    },
  );
}