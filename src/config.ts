import type { IvaConfig } from "./types.js";

export function loadConfig(): IvaConfig {
  const rawBaseUrl = process.env.IVA_BASE_URL;
  if (!rawBaseUrl) {
    throw new Error(
      "IVA_BASE_URL environment variable is required (e.g. https://your-iva-server.ru)"
    );
  }

  let url: URL;
  try {
    url = new URL(rawBaseUrl);
  } catch {
    throw new Error(
      `Invalid IVA_BASE_URL: ${rawBaseUrl}. It must be a valid URL such as https://your-iva-server.ru`
    );
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error(
      `Invalid IVA_BASE_URL protocol: ${url.protocol}. Only http: and https: are supported.`
    );
  }
  if (url.username || url.password) {
    throw new Error(
      "IVA_BASE_URL must not contain credentials. Use environment variables for authentication."
    );
  }

  const baseUrl = `${url.protocol}//${url.host}`;

  return {
    baseUrl,
    sessionToken: process.env.IVA_SESSION_TOKEN,
    jwtToken: process.env.IVA_JWT_TOKEN,
    login: process.env.IVA_LOGIN,
    password: process.env.IVA_PASSWORD,
    confirmDestructive: process.env.IVA_CONFIRM_DESTRUCTIVE === "true",
  };
}