import type { IvaApiClient } from "../api-client.js";
import type { ApiType, HttpMethod, ToolDefinition } from "../types.js";
import { errorResult, successResult } from "../error.js";
import { validateArgs } from "./validate.js";

const DESTRUCTIVE_KEYWORDS = [
  "delete", "remove", "disconnect", "clear", "block", "unblock",
  "stop", "cancel", "reject", "mute", "pause", "destroy",
];

function isDestructiveAction(action: string, mapping: ActionMapping): boolean {
  if (mapping.method === "DELETE") return true;
  const lower = action.toLowerCase();
  return DESTRUCTIVE_KEYWORDS.some((kw) => lower.includes(kw));
}

export interface ActionMapping {
  apiType: ApiType;
  method: HttpMethod;
  path: string;
  pathParams?: string[];
  queryParams?: string[];
  bodyParam?: string;
  bodyWrapper?: string;
  emptyBody?: boolean;
  rawBody?: boolean;
}

export function createActionTool(
  name: string,
  description: string,
  actionEnum: string[],
  paramSchema: Record<string, unknown>,
  mappings: Record<string, ActionMapping>,
  client: IvaApiClient,
  actionDescriptions?: Record<string, string>,
): ToolDefinition {
  const actionDesc = actionDescriptions
    ? Object.entries(actionDescriptions)
        .map(([k, v]) => `  - "${k}": ${v}`)
        .join("\n")
    : `One of: ${actionEnum.join(", ")}`;

  return {
    name,
    description,
    inputSchema: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: actionEnum,
          description: `Operation to perform:\n${actionDesc}`,
        },
        confirm: {
          type: "boolean",
          description: "Set to true to confirm destructive actions (delete, remove, stop, etc.) when IVA_CONFIRM_DESTRUCTIVE is enabled.",
        },
        ...paramSchema,
      },
      required: ["action"],
    },
    handler: async (args) => {
      const validationError = validateArgs(args, {
        properties: {
          action: {
            type: "string",
            enum: actionEnum,
          },
          confirm: { type: "boolean" },
          ...paramSchema,
        },
        required: ["action"],
      });
      if (validationError) {
        return errorResult(validationError);
      }

      const action = args.action as string;
      const mapping = mappings[action];
      if (!mapping) {
        return errorResult(
          `Unknown action: ${action}. Available: ${Object.keys(mappings).join(", ")}`,
        );
      }

      if (client.isConfirmDestructive() && isDestructiveAction(action, mapping) && !args.confirm) {
        return {
          content: [{
            type: "text",
            text: `⚠️ Confirmation required.\n\nYou are about to perform a destructive action: "${action}" on tool "${name}".\nThis may delete, remove, or modify data on the IVA MCU server.\n\nTo proceed, call this tool again with the same arguments AND add "confirm": true.\n\nIf this was not intended, do not proceed.`,
          }],
          isError: true,
        };
      }

      const pathParams: Record<string, string | number> = {};
      if (mapping.pathParams) {
        for (const p of mapping.pathParams) {
          const val = args[p];
          if (val === undefined || val === null) {
            return errorResult(
              `Parameter '${p}' is required for action '${action}'`,
            );
          }
          pathParams[p] = val as string | number;
        }
      }

      const queryParams: Record<string, unknown> = {};
      if (mapping.queryParams) {
        for (const p of mapping.queryParams) {
          if (args[p] !== undefined && args[p] !== null) {
            queryParams[p] = args[p];
          }
        }
      }

      let body: unknown;
      if (mapping.emptyBody) {
        body = {};
      } else if (mapping.bodyParam) {
        body = args[mapping.bodyParam];
        if (body === undefined || body === null) {
          return errorResult(
            `Parameter '${mapping.bodyParam}' is required for action '${action}'`,
          );
        }
        if (mapping.bodyWrapper) {
          body = { [mapping.bodyWrapper]: body };
        }
      } else if (mapping.rawBody) {
        const { action: _action, ...rest } = args;
        body = Object.keys(rest).length > 0 ? rest : {};
      }

      const result = await client.request({
        apiType: mapping.apiType,
        method: mapping.method,
        path: mapping.path,
        pathParams: Object.keys(pathParams).length > 0 ? pathParams : undefined,
        queryParams: Object.keys(queryParams).length > 0 ? queryParams : undefined,
        body,
      });
      return successResult(result);
    },
  };
}