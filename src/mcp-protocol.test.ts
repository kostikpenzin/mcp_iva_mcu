import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { spawn, ChildProcess } from "child_process";
import { resolve as resolvePath } from "path";

function sendMcpMessage(proc: ChildProcess, msg: object): void {
  proc.stdin?.write(JSON.stringify(msg) + "\n");
}

function waitForMessage(proc: ChildProcess, id: number, timeout = 5000): Promise<any> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timeout waiting for id=${id}`)), timeout);
    let buffer = "";
    proc.stdout?.on("data", (data: Buffer) => {
      buffer += data.toString();
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const msg = JSON.parse(line);
          if (msg.id === id) {
            clearTimeout(timer);
            resolve(msg);
          }
        } catch {
          // ignore non-JSON lines
        }
      }
    });
  });
}

describe("MCP server end-to-end protocol", () => {
  let proc: ChildProcess;
  const env = {
    ...process.env,
    IVA_BASE_URL: "https://test.example.ru",
    IVA_SESSION_TOKEN: "test-session",
  };

  beforeAll(async () => {
    proc = spawn("node", [resolvePath("dist/index.js")], {
      env,
      stdio: ["pipe", "pipe", "pipe"],
    });
    proc.on("error", (err) => console.error("Spawn error:", err));
    await new Promise((r) => setTimeout(r, 500));
  });

  afterAll(() => {
    proc.kill();
  });

  it("responds to initialize with server info", async () => {
    sendMcpMessage(proc, {
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2024-11-05",
        capabilities: {},
        clientInfo: { name: "test", version: "1.0" },
      },
    });
    const msg = await waitForMessage(proc, 1);
    expect(msg.result).toBeDefined();
    expect(msg.result.serverInfo.name).toBe("mcp-iva-mcu");
    expect(msg.result.serverInfo.version).toBe("1.4.3");
    expect(msg.result.protocolVersion).toBe("2024-11-05");
    expect(msg.result.capabilities.tools).toBeDefined();
    expect(msg.result.instructions).toContain("IVA MCU");
  });

  it("responds to tools/list with 40 tools", async () => {
    // Send initialized notification first
    sendMcpMessage(proc, {
      jsonrpc: "2.0",
      method: "notifications/initialized",
    });
    sendMcpMessage(proc, {
      jsonrpc: "2.0",
      id: 2,
      method: "tools/list",
      params: {},
    });
    const msg = await waitForMessage(proc, 2);
    expect(msg.result.tools).toBeDefined();
    expect(msg.result.tools).toHaveLength(40);
  });

  it("returns validation error for invalid UUID in tools/call", async () => {
    sendMcpMessage(proc, {
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: {
        name: "iva_conference",
        arguments: { action: "get", conferenceId: "not-a-uuid" },
      },
    });
    const msg = await waitForMessage(proc, 3);
    expect(msg.result.isError).toBe(true);
    expect(msg.result.content[0].text).toContain("Validation failed");
  });

  it("returns error for unknown tool name", async () => {
    sendMcpMessage(proc, {
      jsonrpc: "2.0",
      id: 4,
      method: "tools/call",
      params: {
        name: "nonexistent_tool",
        arguments: {},
      },
    });
    const msg = await waitForMessage(proc, 4);
    expect(msg.result.isError).toBe(true);
    expect(msg.result.content[0].text).toContain("Unknown tool");
  });
});