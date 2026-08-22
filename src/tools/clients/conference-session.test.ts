import { describe, it, expect, vi } from "vitest";
import { createConferenceSessionTool } from "./conference-session.js";
import type { IvaApiClient } from "../../api-client.js";

function createMockClient(sessions: unknown): IvaApiClient {
  return {
    request: vi.fn().mockResolvedValue(sessions),
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    baseUrl: "https://test.example.ru",
    getAuthHeaders: vi.fn().mockResolvedValue({ Session: "test" }),
    isConfirmDestructive: vi.fn().mockReturnValue(false),
  } as unknown as IvaApiClient;
}

function parseContent(result: { content: { text: string }[] }): unknown {
  return JSON.parse(result.content[0].text);
}

describe("iva_conference_session — enrichSessionDurations", () => {
  // Fresh copies per test — the enrich transform mutates in place (like the
  // production response objects, which are freshly parsed each request).
  function freshSessions() {
    return [
      { name: "Daily", actualStartDate: 1787554800000, actualEndDate: 1787556600000, duration: 1800000, state: "STOPPED" }, // 30 min
      { name: "Sync", actualStartDate: 1787556600000, actualEndDate: 1787557080000, duration: 3600000, state: "STOPPED" }, // 8 min
      { name: "Planned only", startDate: 1787554800000, duration: 1800000, state: "NO_STARTED" }, // no actual dates
    ];
  }

  it("adds actualDurationMs and actualDuration for finished sessions on find", async () => {
    const tool = createConferenceSessionTool(createMockClient(freshSessions()));
    const result = await tool.handler({ action: "find", dateFrom: 1, dateTo: 2 });
    const data = parseContent(result as unknown as { content: { text: string }[] }) as Array<Record<string, unknown>>;

    expect(data).toHaveLength(3);
    expect(data[0].actualDurationMs).toBe(1800000);
    expect(data[0].actualDuration).toBe("30 мин");
    expect(data[1].actualDurationMs).toBe(480000);
    expect(data[1].actualDuration).toBe("8 мин");
    // Session without actual dates is left untouched (no enrichment fields added).
    expect(data[2].actualDurationMs).toBeUndefined();
  });

  it("does not enrich non-find actions", async () => {
    const tool = createConferenceSessionTool(createMockClient(freshSessions()[0]));
    const result = await tool.handler({ action: "get", conferenceSessionId: "f1062806-3902-4f07-a493-f9a03a63dd36" });
    const data = parseContent(result as unknown as { content: { text: string }[] }) as Record<string, unknown>;
    expect(data.actualDurationMs).toBeUndefined();
  });

  it("handles wrapped response shapes (obj.data)", async () => {
    const wrapped = { data: freshSessions().slice(0, 2), hasNext: false };
    const tool = createConferenceSessionTool(createMockClient(wrapped));
    const result = await tool.handler({ action: "find", dateFrom: 1, dateTo: 2 });
    const data = parseContent(result as unknown as { content: { text: string }[] }) as { data: Array<Record<string, unknown>> };
    expect(data.data[0].actualDurationMs).toBe(1800000);
    expect(data.data[1].actualDuration).toBe("8 мин");
  });
});