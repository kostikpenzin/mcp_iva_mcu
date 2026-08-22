import { describe, it, expect, vi } from "vitest";
import { createActionTool } from "./framework.js";
import type { IvaApiClient } from "../api-client.js";

function createMockClient(confirmDestructive = false): IvaApiClient {
  return {
    request: vi.fn().mockResolvedValue({ ok: true }),
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    baseUrl: "https://test.example.ru",
    getAuthHeaders: vi.fn().mockResolvedValue({ Session: "test" }),
    isConfirmDestructive: vi.fn().mockReturnValue(confirmDestructive),
  } as unknown as IvaApiClient;
}

describe("createActionTool", () => {
  it("wraps a primitive bodyParam in a DTO object", async () => {
    const client = createMockClient();
    const tool = createActionTool(
      "test_tool",
      "Test tool",
      ["set_reaction"],
      { reaction: { type: "string", description: "Reaction" } },
      {
        set_reaction: {
          apiType: "clients",
          method: "POST",
          path: "/reactions",
          bodyParam: "reaction",
          bodyWrapper: "reaction",
        },
      },
      client,
    );

    const result = await tool.handler({ action: "set_reaction", reaction: "LIKE" });
    expect(result.isError).toBeUndefined();
    expect(client.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "POST",
        path: "/reactions",
        body: { reaction: "LIKE" },
      }),
    );
  });

  it("wraps an array bodyParam in a DTO object", async () => {
    const client = createMockClient();
    const tool = createActionTool(
      "test_tool",
      "Test tool",
      ["delete_multiple"],
      {
        messageIds: {
          type: "array",
          items: { type: "string", format: "uuid" },
          description: "Message IDs",
        },
      },
      {
        delete_multiple: {
          apiType: "clients",
          method: "POST",
          path: "/messages/remove",
          bodyParam: "messageIds",
          bodyWrapper: "messageIds",
        },
      },
      client,
    );

    const result = await tool.handler({
      action: "delete_multiple",
      messageIds: ["550e8400-e29b-41d4-a716-446655440000"],
    });
    expect(result.isError).toBeUndefined();
    expect(client.request).toHaveBeenCalledWith(
      expect.objectContaining({
        body: { messageIds: ["550e8400-e29b-41d4-a716-446655440000"] },
      }),
    );
  });

  it("returns validation error for invalid UUID", async () => {
    const client = createMockClient();
    const tool = createActionTool(
      "test_tool",
      "Test tool",
      ["get"],
      { chatRoomId: { type: "string", format: "uuid", description: "Chat ID" } },
      {
        get: {
          apiType: "clients",
          method: "GET",
          path: "/chats/{chatRoomId}",
          pathParams: ["chatRoomId"],
        },
      },
      client,
    );

    const result = await tool.handler({ action: "get", chatRoomId: "not-a-uuid" });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Validation failed");
  });

  it("returns error for unknown action", async () => {
    const client = createMockClient();
    const tool = createActionTool(
      "test_tool",
      "Test tool",
      ["get"],
      {},
      {
        get: {
          apiType: "clients",
          method: "GET",
          path: "/test",
        },
      },
      client,
    );

    const result = await tool.handler({ action: "unknown" });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toMatch(/Validation failed|Unknown action/);
  });

  it("blocks destructive action when confirmDestructive is enabled and confirm is not set", async () => {
    const client = createMockClient(true);
    const tool = createActionTool(
      "test_tool",
      "Test tool",
      ["delete"],
      { resourceId: { type: "string", format: "uuid", description: "Resource ID" } },
      {
        delete: {
          apiType: "clients",
          method: "DELETE",
          path: "/resources/{resourceId}",
          pathParams: ["resourceId"],
        },
      },
      client,
    );

    const result = await tool.handler({
      action: "delete",
      resourceId: "550e8400-e29b-41d4-a716-446655440000",
    });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Confirmation required");
    expect(client.request).not.toHaveBeenCalled();
  });

  it("allows destructive action when confirmDestructive is enabled and confirm is true", async () => {
    const client = createMockClient(true);
    const tool = createActionTool(
      "test_tool",
      "Test tool",
      ["delete"],
      { resourceId: { type: "string", format: "uuid", description: "Resource ID" } },
      {
        delete: {
          apiType: "clients",
          method: "DELETE",
          path: "/resources/{resourceId}",
          pathParams: ["resourceId"],
        },
      },
      client,
    );

    const result = await tool.handler({
      action: "delete",
      resourceId: "550e8400-e29b-41d4-a716-446655440000",
      confirm: true,
    });
    expect(result.isError).toBeUndefined();
    expect(client.request).toHaveBeenCalled();
  });

  it("allows destructive action when confirmDestructive is disabled", async () => {
    const client = createMockClient(false);
    const tool = createActionTool(
      "test_tool",
      "Test tool",
      ["delete"],
      { resourceId: { type: "string", format: "uuid", description: "Resource ID" } },
      {
        delete: {
          apiType: "clients",
          method: "DELETE",
          path: "/resources/{resourceId}",
          pathParams: ["resourceId"],
        },
      },
      client,
    );

    const result = await tool.handler({
      action: "delete",
      resourceId: "550e8400-e29b-41d4-a716-446655440000",
    });
    expect(result.isError).toBeUndefined();
    expect(client.request).toHaveBeenCalled();
  });

  it("rawBody strips action, confirm, pathParams, and queryParams from the request body", async () => {
    const client = createMockClient();
    const tool = createActionTool(
      "test_tool",
      "Test tool",
      ["upload"],
      {
        resourceId: { type: "string", format: "uuid", description: "Resource ID" },
        visibility: { type: "string", description: "Visibility query param" },
      },
      {
        upload: {
          apiType: "clients",
          method: "POST",
          path: "/resources/{resourceId}",
          pathParams: ["resourceId"],
          queryParams: ["visibility"],
          rawBody: true,
        },
      },
      client,
    );

    await tool.handler({
      action: "upload",
      resourceId: "550e8400-e29b-41d4-a716-446655440000",
      visibility: "public",
      confirm: true,
      fileName: "doc.pdf",
      size: 1024,
    });
    const call = (client.request as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(call.body).toEqual({ fileName: "doc.pdf", size: 1024 });
    expect(call.body).not.toHaveProperty("action");
    expect(call.body).not.toHaveProperty("confirm");
    expect(call.body).not.toHaveProperty("resourceId");
    expect(call.body).not.toHaveProperty("visibility");
    expect(call.pathParams).toEqual({ resourceId: "550e8400-e29b-41d4-a716-446655440000" });
    expect(call.queryParams).toEqual({ visibility: "public" });
  });

  it("rawBody sends empty object when no extra fields are provided", async () => {
    const client = createMockClient();
    const tool = createActionTool(
      "test_tool",
      "Test tool",
      ["create_dir"],
      { resourceId: { type: "string", format: "uuid", description: "Resource ID" } },
      {
        create_dir: {
          apiType: "clients",
          method: "POST",
          path: "/resources/{resourceId}/dir",
          pathParams: ["resourceId"],
          rawBody: true,
        },
      },
      client,
    );

    await tool.handler({
      action: "create_dir",
      resourceId: "550e8400-e29b-41d4-a716-446655440000",
    });
    const call = (client.request as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(call.body).toEqual({});
  });
});
