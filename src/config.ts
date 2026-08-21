import type { IvaConfig } from "./types.js";

export function loadConfig(): IvaConfig {
  const baseUrl = process.env.IVA_BASE_URL;
  if (!baseUrl) {
    throw new Error(
      "IVA_BASE_URL environment variable is required (e.g. https://your-iva-server.ru)"
    );
  }

  return {
    baseUrl: baseUrl.replace(/\/+$/, ""),
    sessionToken: process.env.IVA_SESSION_TOKEN,
    jwtToken: process.env.IVA_JWT_TOKEN,
    integrationToken: process.env.IVA_INTEGRATION_TOKEN,
    botToken: process.env.IVA_BOT_TOKEN,
  };
}