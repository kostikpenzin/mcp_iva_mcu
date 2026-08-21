import Ajv from "ajv";
import ajvFormats from "ajv-formats";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ajv = new (Ajv as any)({ allErrors: true, coerceTypes: true });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(ajvFormats as any)(ajv);

export function formatAjvErrors(errors: Ajv.ErrorObject[]): string {
  const messages = errors.map((err) => {
    const path = err.instancePath || "args";
    const param = path.replace(/^\//, "").replace(/\//g, ".") || "args";
    return `${param}: ${err.message}`;
  });
  return `Validation failed:\n${messages.join("\n")}`;
}

export function validateArgs(
  args: Record<string, unknown>,
  schema: { properties: Record<string, unknown>; required: string[] },
): string | null {
  const validate = ajv.compile({
    type: "object",
    properties: schema.properties,
    required: schema.required,
    additionalProperties: true,
  });
  const valid = validate(args);
  if (!valid && validate.errors) {
    return formatAjvErrors(validate.errors);
  }
  return null;
}
