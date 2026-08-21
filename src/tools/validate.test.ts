import { describe, it, expect } from "vitest";
import { validateArgs, formatAjvErrors } from "./validate.js";

describe("validateArgs", () => {
  it("passes valid UUID", () => {
    const error = validateArgs(
      { action: "get", chatRoomId: "550e8400-e29b-41d4-a716-446655440000" },
      {
        properties: {
          action: { type: "string", enum: ["get"] },
          chatRoomId: { type: "string", format: "uuid" },
        },
        required: ["action"],
      },
    );
    expect(error).toBeNull();
  });

  it("fails on invalid UUID", () => {
    const error = validateArgs(
      { action: "get", chatRoomId: "not-a-uuid" },
      {
        properties: {
          action: { type: "string", enum: ["get"] },
          chatRoomId: { type: "string", format: "uuid" },
        },
        required: ["action"],
      },
    );
    expect(error).not.toBeNull();
    expect(error).toContain("uuid");
  });

  it("fails on missing required action", () => {
    const error = validateArgs(
      {},
      {
        properties: {
          action: { type: "string", enum: ["get"] },
        },
        required: ["action"],
      },
    );
    expect(error).not.toBeNull();
    expect(error).toContain("action");
  });

  it("fails on invalid enum value", () => {
    const error = validateArgs(
      { action: "invalid_action" },
      {
        properties: {
          action: { type: "string", enum: ["get", "create", "delete"] },
        },
        required: ["action"],
      },
    );
    expect(error).not.toBeNull();
    expect(error).toContain("allowed values");
  });

  it("passes valid integer with minimum", () => {
    const error = validateArgs(
      { action: "find", limit: 10 },
      {
        properties: {
          action: { type: "string", enum: ["find"] },
          limit: { type: "integer", minimum: 0 },
        },
        required: ["action"],
      },
    );
    expect(error).toBeNull();
  });

  it("fails on negative integer when minimum is 0", () => {
    const error = validateArgs(
      { action: "find", limit: -5 },
      {
        properties: {
          action: { type: "string", enum: ["find"] },
          limit: { type: "integer", minimum: 0 },
        },
        required: ["action"],
      },
    );
    expect(error).not.toBeNull();
    expect(error).toContain("limit");
  });

  it("coerces string number to integer", () => {
    const error = validateArgs(
      { action: "find", limit: "10" },
      {
        properties: {
          action: { type: "string", enum: ["find"] },
          limit: { type: "integer", minimum: 0 },
        },
        required: ["action"],
      },
    );
    expect(error).toBeNull();
  });

  it("passes valid array of UUIDs", () => {
    const error = validateArgs(
      {
        action: "delete_multiple",
        messageIds: ["550e8400-e29b-41d4-a716-446655440000"],
      },
      {
        properties: {
          action: { type: "string", enum: ["delete_multiple"] },
          messageIds: { type: "array", items: { type: "string", format: "uuid" } },
        },
        required: ["action"],
      },
    );
    expect(error).toBeNull();
  });

  it("fails on array with invalid UUID item", () => {
    const error = validateArgs(
      {
        action: "delete_multiple",
        messageIds: ["not-a-uuid"],
      },
      {
        properties: {
          action: { type: "string", enum: ["delete_multiple"] },
          messageIds: { type: "array", items: { type: "string", format: "uuid" } },
        },
        required: ["action"],
      },
    );
    expect(error).not.toBeNull();
  });

  it("passes valid boolean", () => {
    const error = validateArgs(
      { action: "delete", confirm: true },
      {
        properties: {
          action: { type: "string", enum: ["delete"] },
          confirm: { type: "boolean" },
        },
        required: ["action"],
      },
    );
    expect(error).toBeNull();
  });

  it("ignores undefined optional params", () => {
    const error = validateArgs(
      { action: "get" },
      {
        properties: {
          action: { type: "string", enum: ["get"] },
          limit: { type: "integer", minimum: 0 },
          offset: { type: "integer", minimum: 0 },
        },
        required: ["action"],
      },
    );
    expect(error).toBeNull();
  });
});

describe("formatAjvErrors", () => {
  it("formats error messages", () => {
    const errors = [
      {
        instancePath: "/chatRoomId",
        message: "must match format uuid",
        schemaPath: "",
        keyword: "",
        params: {},
      },
    ];
    const result = formatAjvErrors(errors as never);
    expect(result).toContain("Validation failed");
    expect(result).toContain("chatRoomId");
    expect(result).toContain("uuid");
  });
});