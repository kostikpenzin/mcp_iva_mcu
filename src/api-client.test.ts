import { describe, it, expect, vi } from "vitest";
import { IvaApiClient } from "./api-client.js";
import { IvaApiError } from "./error.js";
import type { ApiRequestOptions } from "./types.js";

describe("IvaApiClient", () => {
  const config = {
    baseUrl: "https://test.example.ru",
    sessionToken: "session-uuid",
    confirmDestructive: false,
  };

  function req(overrides: Partial<ApiRequestOptions> = {}): ApiRequestOptions {
    return { apiType: "clients", method: "GET", path: "/test", ...overrides };
  }

  it("builds the correct URL with path and query parameters", async () => {
    const client = new IvaApiClient(config);
    global.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ id: "123" }), { status: 200 }),
    );

    await client.request({
      apiType: "clients",
      method: "GET",
      path: "/chats/{chatRoomId}",
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

    await client.request(req());

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

  it("deduplicates concurrent auto-logins into a single login request", async () => {
    const loginConfig = {
      baseUrl: "https://test.example.ru",
      login: "user@example.ru",
      password: "pass123",
      confirmDestructive: false,
    };
    const client = new IvaApiClient(loginConfig);
    global.fetch = vi.fn().mockImplementation(async (url: string | URL, init?: RequestInit) => {
      if (String(url).endsWith("/login")) {
        return new Response(JSON.stringify({ sessionId: "shared-session" }), { status: 200 });
      }
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    });

    await Promise.all([
      client.request({ apiType: "clients", method: "GET", path: "/a" }),
      client.request({ apiType: "clients", method: "GET", path: "/b" }),
      client.request({ apiType: "clients", method: "GET", path: "/c" }),
    ]);

    const loginCalls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls.filter(
      (call) => String(call[0]).endsWith("/login"),
    );
    expect(loginCalls).toHaveLength(1);
  });

  it("throws a readable IvaApiError when login returns a non-JSON body", async () => {
    const loginConfig = {
      baseUrl: "https://test.example.ru",
      login: "user@example.ru",
      password: "pass123",
      confirmDestructive: false,
    };
    const client = new IvaApiClient(loginConfig);
    global.fetch = vi
      .fn()
      .mockResolvedValue(new Response("<html>502 Bad Gateway</html>", { status: 200 }));

    await expect(client.request(req())).rejects.toThrow(
      "Auto-login failed: server returned a non-JSON response",
    );
  });

  it("throws IvaApiError when login returns an HTTP error status", async () => {
    const loginConfig = {
      baseUrl: "https://test.example.ru",
      login: "user@example.ru",
      password: "wrong-pass",
      confirmDestructive: false,
    };
    const client = new IvaApiClient(loginConfig);
    global.fetch = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ message: "Bad credentials" }), { status: 403 }));

    await expect(client.request(req())).rejects.toMatchObject({
      status: 403,
      reason: "AUTH_LOGIN_FAILED",
    });
  });

  it("uses the Session auth header for the clients API", async () => {
    const client = new IvaApiClient(config);
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce(new Response("{}", { status: 200 }));

    await client.request(req());
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

    const result = await client.request(req());

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

    await expect(client.request(req())).rejects.toThrow(IvaApiError);
    // Only one attempt — no re-login possible with a static token.
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("clearSessionToken forces a fresh login on the next request", async () => {
    const loginConfig = {
      baseUrl: "https://test.example.ru",
      login: "user@example.ru",
      password: "pass123",
      confirmDestructive: false,
    };
    const client = new IvaApiClient(loginConfig);
    global.fetch = vi.fn().mockImplementation(async (url: string | URL) => {
      if (String(url).endsWith("/login")) {
        return new Response(JSON.stringify({ sessionId: "fresh-session" }), { status: 200 });
      }
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    });

    await client.request(req());
    client.clearSessionToken();
    await client.request(req());

    const loginCalls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls.filter(
      (call) => String(call[0]).endsWith("/login"),
    );
    expect(loginCalls).toHaveLength(2);
  });

  it("throws IvaApiError on non-OK response", async () => {
    const client = new IvaApiClient(config);
    global.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: "Not found", reason: "NOT_FOUND" }), {
        status: 404,
      }),
    );

    await expect(client.request(req())).rejects.toThrow(IvaApiError);
  });

  it("throws timeout error on abort", async () => {
    const client = new IvaApiClient(config);
    global.fetch = vi.fn().mockImplementation(() => {
      const err = new Error("The operation was aborted");
      err.name = "AbortError";
      return Promise.reject(err);
    });

    await expect(client.request(req())).rejects.toThrow(
      "Request timed out",
    );
  });
});