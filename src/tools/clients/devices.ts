import type { IvaApiClient } from "../../api-client.js";
import type { ToolDefinition } from "../../types.js";
import { createActionTool } from "../framework.js";
import { P } from "../params.js";

export function createDevicesTool(client: IvaApiClient): ToolDefinition {
  return createActionTool(
    "iva_devices",
    "IVA device management: register and deregister user devices. Clients API v2.28.12.",
    ["register", "deregister"],
    {
      profileId: P.profileId,
      deviceId: P.deviceId,
      deviceData: { type: "object", description: "Device registration data" },
    },
    {
      register: { apiType: "clients", method: "POST", path: "/profiles/{profileId}/devices/register", pathParams: ["profileId"], bodyParam: "deviceData" },
      deregister: { apiType: "clients", method: "POST", path: "/profiles/{profileId}/devices/{deviceId}/deregister", pathParams: ["profileId", "deviceId"], emptyBody: true },
    },
    client,
    {
      register: "Register a user device (phone, softphone, etc.) for SIP/VoIP. Зарегистрировать устройство пользователя.",
      deregister: "Deregister/unregister a user device. Снять регистрацию устройства. Удалить устройство.",
    },
  );
}