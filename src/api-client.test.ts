import { describe, it, expect, vi } from "vitest";
import { IvaApiClient } from "./api-client.js";
import { IvaApiError } from "./error.js";

describe("IvaApiClient", () => {
  const config = {
    baseUrl: "https://test.example.ru",
    sessionToken: "session-uuid",
    integrationToken: "integration-token",
    botToken: "bot-token",
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
        headers: expect.objectContaining({ Session: "session-uuid" }),
      }),
    );
  });

  it("uses the correct auth header for each API type", async () => {
    const client = new IvaApiClient(config);
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce(new Response("{}", { status: 200 }))
      .mockResolvedValueOnce(new Response("{}", { status: 200 }))
      .mockResolvedValueOnce(new Response("{}", { status: 200 }));

    await client.get("clients", "/test");
    expect(global.fetch).toHaveBeenNthCalledWith(
      1,
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({ Session: "session-uuid" }),
      }),
    );

    await client.get("integration", "/test");
    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: "Bearer integration-token" }),
      }),
    );

    await client.get("bot", "/test");
    expect(global.fetch).toHaveBeenNthCalledWith(
      3,
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({ "X-Iva-Bot-Api-Token": "bot-token" }),
      }),
    );
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
