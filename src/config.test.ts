import { describe, it, expect } from "vitest";
import { loadConfig } from "./config.js";

describe("loadConfig", () => {
  const baseEnv = process.env;

  it("returns config for a valid https URL", () => {
    process.env = {
      ...baseEnv,
      IVA_BASE_URL: "https://meet.example.ru/",
      IVA_SESSION_TOKEN: "session-uuid",
    };

    const config = loadConfig();
    expect(config.baseUrl).toBe("https://meet.example.ru");
    expect(config.sessionToken).toBe("session-uuid");
  });

  it("rejects http URLs unless IVA_ALLOW_HTTP=true", () => {
    process.env = {
      ...baseEnv,
      IVA_BASE_URL: "http://localhost:8080",
      IVA_ALLOW_HTTP: undefined,
    };
    expect(() => loadConfig()).toThrow(
      "Insecure IVA_BASE_URL: http: would send login/password in plaintext",
    );
  });

  it("allows http URLs when IVA_ALLOW_HTTP=true", () => {
    process.env = {
      ...baseEnv,
      IVA_BASE_URL: "http://localhost:8080",
      IVA_ALLOW_HTTP: "true",
    };

    const config = loadConfig();
    expect(config.baseUrl).toBe("http://localhost:8080");
  });

  it("throws when IVA_BASE_URL is missing", () => {
    process.env = { ...baseEnv, IVA_BASE_URL: undefined };
    expect(() => loadConfig()).toThrow("IVA_BASE_URL environment variable is required");
  });

  it("throws when IVA_BASE_URL is invalid", () => {
    process.env = { ...baseEnv, IVA_BASE_URL: "not-a-url" };
    expect(() => loadConfig()).toThrow("Invalid IVA_BASE_URL");
  });

  it("throws when IVA_BASE_URL uses unsupported protocol", () => {
    process.env = { ...baseEnv, IVA_BASE_URL: "ftp://meet.example.ru" };
    expect(() => loadConfig()).toThrow("Only http: and https: are supported");
  });

  it("throws when IVA_BASE_URL contains credentials", () => {
    process.env = { ...baseEnv, IVA_BASE_URL: "https://user:pass@meet.example.ru" };
    expect(() => loadConfig()).toThrow("must not contain credentials");
  });
});
