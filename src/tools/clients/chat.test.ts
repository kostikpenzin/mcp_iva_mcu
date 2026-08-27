import { describe, it, expect, vi } from "vitest";
import { createChatTool } from "./chat.js";
import type { IvaApiClient } from "../../api-client.js";

function mockClient(response: unknown): IvaApiClient {
  return {
    request: vi.fn().mockResolvedValue(response),
    isConfirmDestructive: vi.fn().mockReturnValue(false),
  } as unknown as IvaApiClient;
}

const unnamed = {
  id: "chat-1",
  users: [{ name: "Алиса" }, { name: "Боб" }],
};
const named = { id: "chat-2", name: "Дизайн", users: [{ name: "Алиса" }] };

async function runAction(action: string, response: unknown, args: Record<string, unknown> = {}) {
  const client = mockClient(response);
  const tool = createChatTool(client);
  const result = await tool.handler({ action, ...args });
  expect(result.isError).toBeFalsy();
  return JSON.parse(result.content[0].text);
}

describe("iva_chat — chat name auto-filling", () => {
  it("fills names for unnamed chats in a get_all array response", async () => {
    const data = await runAction("get_all", [unnamed, named]);
    expect(data[0].name).toBe("Алиса, Боб");
    // Named chats are left untouched.
    expect(data[1].name).toBe("Дизайн");
  });

  it("fills names inside a { data: [...] } wrapper for search", async () => {
    const data = await runAction("search", { data: [unnamed] });
    expect(data.data[0].name).toBe("Алиса, Боб");
  });

  it("fills the name of a single chat for get_p2p and get", async () => {
    const p2p = await runAction("get_p2p", { ...unnamed });
    expect(p2p.name).toBe("Алиса, Боб");
    const got = await runAction(
      "get",
      { ...unnamed },
      { chatRoomId: "550e8400-e29b-41d4-a716-446655440000" },
    );
    expect(got.name).toBe("Алиса, Боб");
  });

  it("does not invent a name when users have no names", async () => {
    const data = await runAction("get_all", [{ id: "chat-3", users: [{}] }]);
    expect(data[0].name).toBeUndefined();
  });

  it("leaves responses of other actions untouched", async () => {
    const data = await runAction("get_muted", { chatIds: ["x"] });
    expect(data).toEqual({ chatIds: ["x"] });
  });

  it("skips filling when the chat has no users", async () => {
    const data = await runAction("get_all", [{ id: "chat-4", name: "" }]);
    expect(data[0].name).toBe("");
  });
});