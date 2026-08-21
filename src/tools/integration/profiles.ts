import type { IvaApiClient } from "../../api-client.js";
import type { ToolDefinition } from "../../types.js";
import { createActionTool } from "../framework.js";
import { P } from "../params.js";

export function createIntegrationProfilesTool(client: IvaApiClient): ToolDefinition {
  return createActionTool(
    "iva_integration_profiles",
    "IVA Integration API — profiles: get profile information by ID. Integration API v1.28.12.",
    ["get"],
    { profileId: P.profileId },
    { get: { apiType: "integration", method: "GET", path: "/profiles/{profileId}", pathParams: ["profileId"] } },
    client,
    {
      get: "Получить информацию о профиле пользователя / Get profile information by profileId.",
    },
  );
}