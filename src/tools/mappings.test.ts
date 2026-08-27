import { describe, it, expect, vi } from "vitest";
import { getAllTools } from "./index.js";
import type { IvaApiClient } from "../api-client.js";
import type { HttpMethod } from "../types.js";

const VALID_METHODS: HttpMethod[] = ["GET", "POST", "PATCH", "PUT", "DELETE"];

// A dummy UUID reused for every UUID-typed parameter.
const DUMMY_UUID = "550e8400-e29b-41d4-a716-446655440000";

function createMockClient(): IvaApiClient {
  return {
    request: vi.fn().mockResolvedValue({ ok: true }),
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    isConfirmDestructive: vi.fn().mockReturnValue(false),
    clearSessionToken: vi.fn(),
  } as unknown as IvaApiClient;
}

/**
 * Build a generous args object that supplies a dummy value for every property
 * declared in the tool's input schema. This lets us call any action without
 * tripping "parameter X is required" guards, so we can inspect the actual
 * request that the mapping produces.
 */
function buildArgs(properties: Record<string, unknown>): Record<string, unknown> {
  const args: Record<string, unknown> = {};
  for (const [key, schemaRaw] of Object.entries(properties)) {
    if (key === "action" || key === "confirm") continue;
    const schema = schemaRaw as Record<string, unknown>;
    if (!schema || typeof schema !== "object") continue;
    const type = schema.type;
    if (schema.format === "uuid") {
      args[key] = DUMMY_UUID;
    } else if (type === "string") {
      args[key] = "test";
    } else if (type === "integer" || type === "number") {
      args[key] = 1;
    } else if (type === "boolean") {
      args[key] = true;
    } else if (type === "array") {
      args[key] = [DUMMY_UUID];
    } else if (type === "object") {
      args[key] = {};
    }
  }
  return args;
}

describe("getAllTools — mapping integrity", () => {
  const client = createMockClient();
  const tools = getAllTools(client);

  for (const tool of tools) {
    describe(`tool ${tool.name}`, () => {
      const actions = (tool.inputSchema.properties.action as Record<string, unknown>)
        .enum as string[];
      const properties = tool.inputSchema.properties as Record<string, unknown>;

      for (const action of actions) {
        it(`action "${action}" has a valid mapping (method + path, no unresolved placeholders)`, async () => {
          const args = { action, confirm: true, ...buildArgs(properties) };
          const requestMock = client.request as ReturnType<typeof vi.fn>;
          requestMock.mockClear();

          const result = await tool.handler(args);

          // If the handler returned an error about a missing parameter, that
          // means the mapping itself exists (it got past "unknown action") —
          // acceptable, since we can't know every required param upfront.
          if (result.isError) {
            const text = result.content[0].text;
            expect(text).not.toMatch(/Unknown action/);
            return;
          }

          // The request mock must have been called exactly once.
          expect(requestMock).toHaveBeenCalledTimes(1);
          const callArg = requestMock.mock.calls[0][0] as {
            method: HttpMethod;
            path: string;
            pathParams?: Record<string, string | number>;
          };

          // Method is one of the valid HTTP methods.
          expect(VALID_METHODS).toContain(callArg.method);

          // Path starts with /.
          expect(callArg.path).toMatch(/^\//);

          // Every {placeholder} in the path must have a matching value in
          // pathParams — otherwise the real API client would send an
          // unresolved URL to the server.
          const placeholders = callArg.path.match(/\{([^}]+)\}/g) ?? [];
          for (const ph of placeholders) {
            const key = ph.slice(1, -1);
            expect(callArg.pathParams).toBeDefined();
            expect(callArg.pathParams![key]).toBeDefined();
          }
        });
      }
    });
  }
});