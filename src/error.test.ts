import { describe, it, expect } from "vitest";
import { IvaApiError, errorResult, apiErrorResult, successResult } from "./error.js";

describe("errorResult", () => {
  it("returns error with isError flag", () => {
    const result = errorResult("Something went wrong");
    expect(result.isError).toBe(true);
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");
    expect(result.content[0].text).toContain("Something went wrong");
    expect(result.content[0].text).toContain("Error:");
  });

  it("handles empty message", () => {
    const result = errorResult("");
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Error:");
  });
});

describe("apiErrorResult", () => {
  it("formats API error with status and message", () => {
    const err = new IvaApiError(404, "Not found", "NOT_FOUND", "IllegalArgumentException");
    const result = apiErrorResult(err);
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("404");
    expect(result.content[0].text).toContain("Not found");
    expect(result.content[0].text).toContain("Reason: NOT_FOUND");
    expect(result.content[0].text).toContain("Type: IllegalArgumentException");
  });

  it("formats API error without optional fields", () => {
    const err = new IvaApiError(500, "Internal error");
    const result = apiErrorResult(err);
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("500");
    expect(result.content[0].text).toContain("Internal error");
    expect(result.content[0].text).not.toContain("Reason:");
    expect(result.content[0].text).not.toContain("Type:");
  });
});

describe("successResult", () => {
  it("stringifies object data", () => {
    const result = successResult({ id: "123", name: "test" });
    expect(result.isError).toBeUndefined();
    expect(result.content[0].text).toContain('"id"');
    expect(result.content[0].text).toContain("123");
  });

  it("passes through string data", () => {
    const result = successResult("plain text response");
    expect(result.isError).toBeUndefined();
    expect(result.content[0].text).toBe("plain text response");
  });

  it("handles null data", () => {
    const result = successResult(null);
    expect(result.isError).toBeUndefined();
  });
});

describe("IvaApiError", () => {
  it("creates error with all fields", () => {
    const err = new IvaApiError(400, "Bad request", "VALIDATION", "ClientException");
    expect(err.status).toBe(400);
    expect(err.message).toBe("Bad request");
    expect(err.reason).toBe("VALIDATION");
    expect(err.type).toBe("ClientException");
    expect(err.name).toBe("IvaApiError");
    expect(err instanceof Error).toBe(true);
  });

  it("creates error with minimal fields", () => {
    const err = new IvaApiError(500, "Server error");
    expect(err.status).toBe(500);
    expect(err.message).toBe("Server error");
    expect(err.reason).toBeUndefined();
    expect(err.type).toBeUndefined();
  });
});