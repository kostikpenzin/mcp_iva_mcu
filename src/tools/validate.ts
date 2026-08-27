import { Ajv, type ErrorObject } from "ajv";
import ajvFormats from "ajv-formats";

const ajv = new Ajv({ allErrors: true, coerceTypes: true });
// ajv-formats is CJS; Node16 types its default import as the module namespace,
// but at runtime it is the plugin function. Cast to the specific callable type.
(ajvFormats as unknown as (ajv: Ajv) => void)(ajv);

export function formatAjvErrors(errors: ErrorObject[]): string {
  const messages = errors.map((err) => {
    const path = err.instancePath || "args";
    const param = path.replace(/^\//, "").replace(/\//g, ".") || "args";
    return `${param}: ${err.message}`;
  });
  return `Validation failed:\n${messages.join("\n")}`;
}

// Compiled validators are cached: tool schemas are static, so every call with
// the same schema reuses the compiled validator instead of recompiling.
const compiledCache = new Map<string, ReturnType<Ajv["compile"]>>();

export function validateArgs(
  args: Record<string, unknown>,
  schema: { properties: Record<string, unknown>; required: string[] },
): string | null {
  const cacheKey = JSON.stringify(schema);
  let validate = compiledCache.get(cacheKey);
  if (!validate) {
    validate = ajv.compile({
      type: "object",
      properties: schema.properties,
      required: schema.required,
      additionalProperties: true,
    });
    compiledCache.set(cacheKey, validate);
  }
  const valid = validate(args);
  if (!valid && validate.errors) {
    return formatAjvErrors(validate.errors);
  }
  return null;
}
