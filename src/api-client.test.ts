import { describe, it, expect, vi } from "vitest";
import { IvaApiClient } from "./api-client.js";
import { IvaApiError } from "./error.js";

describe("IvaApiClient", () => {
  const config = {
    baseUrl: "https://test.example.ru",
    sessionToken: "session-uuid",
    confirmDestructive: false,
  };

  it("builds the correct URL with path and query parameters", async () => {
    const client = new IvaApiClient(config);
    global.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ id: "123" }), { status: 200 }),
    );

    await client.get("clients", "/chats/{chatRoomId}", {
      pathParams: { chatRoomId: "abc-123" },
      queryParams: { limit: 10, offset: 0 },
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "https://test.example.ru/api/rest/chats/abc-123?limit=10&offset=0",
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({
          Session: "session-uuid",
          "User-Agent": "mcp-iva360",
        }),
      }),
    );
  });

  it("auto-logins with IVA_LOGIN + IVA_PASSWORD when no session token", async () => {
    const loginConfig = {
      baseUrl: "https://test.example.ru",
      login: "user@example.ru",
      password: "pass123",
    confirmDestructive: false,
    };
    const client = new IvaApiClient(loginConfig);
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ sessionId: "auto-session-uuid" }), { status: 200 }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
      );

    await client.get("clients", "/test");

    // First call: login
    expect(global.fetch).toHaveBeenNthCalledWith(
      1,
      "https://test.example.ru/api/rest/login",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ login: "user@example.ru", password: "pass123" }),
      }),
    );
    // Second call: actual request with auto-obtained session
    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      "https://test.example.ru/api/rest/test",
      expect.objectContaining({
        headers: expect.objectContaining({ Session: "auto-session-uuid" }),
      }),
    );
  });

  it("uses the Session auth header for the clients API", async () => {
    const client = new IvaApiClient(config);
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce(new Response("{}", { status: 200 }));

    await client.get("clients", "/test");
    expect(global.fetch).toHaveBeenNthCalledWith(
      1,
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({ Session: "session-uuid" }),
      }),
    );
  });

  it("re-logins and retries once on 401 when using login/password", async () => {
    const loginConfig = {
      baseUrl: "https://test.example.ru",
      login: "user@example.ru",
      password: "pass123",
      confirmDestructive: false,
    };
    const client = new IvaApiClient(loginConfig);
    // Sequence: login (sessionId A) -> request 401 -> re-login (sessionId B) -> request 200
    global.fetch = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ sessionId: "session-A" }), { status: 200 })) // initial login
      .mockResolvedValueOnce(new Response(JSON.stringify({ message: "No auth context" }), { status: 401 })) // expired
      .mockResolvedValueOnce(new Response(JSON.stringify({ sessionId: "session-B" }), { status: 200 })) // re-login
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 })); // retry success

    const result = await client.get("clients", "/test");

    expect(global.fetch).toHaveBeenCalledTimes(4);
    // 1st call: login -> Session: session-A
    expect(global.fetch).toHaveBeenNthCalledWith(
      1,
      "https://test.example.ru/api/rest/login",
      expect.objectContaining({ method: "POST" }),
    );
    // 2nd call: request with expired session-A -> 401
    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      expect.any(String),
      expect.objectContaining({ headers: expect.objectContaining({ Session: "session-A" }) }),
    );
    // 3rd call: re-login -> session-B
    expect(global.fetch).toHaveBeenNthCalledWith(
      3,
      "https://test.example.ru/api/rest/login",
      expect.objectContaining({ method: "POST" }),
    );
    // 4th call: retry with session-B
    expect(global.fetch).toHaveBeenNthCalledWith(
      4,
      expect.any(String),
      expect.objectContaining({ headers: expect.objectContaining({ Session: "session-B" }) }),
    );
    expect(result).toEqual({ ok: true });
  });

  it("does not retry on 401 when using a static session token", async () => {
    const staticConfig = {
      baseUrl: "https://test.example.ru",
      sessionToken: "static-session",
      confirmDestructive: false,
    };
    const client = new IvaApiClient(staticConfig);
    global.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: "No auth context" }), { status: 401 }),
    );

    await expect(client.get("clients", "/test")).rejects.toThrow(IvaApiError);
    // Only one attempt — no re-login possible with a static token.
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("throws IvaApiError on non-OK response", async () => {
    const client = new IvaApiClient(config);
    global.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: "Not found", reason: "NOT_FOUND" }), {
        status: 404,
      }),
    );

    await expect(client.get("clients", "/test")).rejects.toThrow(IvaApiError);
  });

  it("throws timeout error on abort", async () => {
    const client = new IvaApiClient(config);
    global.fetch = vi.fn().mockImplementation(() => {
      const err = new Error("The operation was aborted");
      err.name = "AbortError";
      return Promise.reject(err);
    });

    await expect(client.get("clients", "/test")).rejects.toThrow(
      "Request timed out",
    );
  });
});
