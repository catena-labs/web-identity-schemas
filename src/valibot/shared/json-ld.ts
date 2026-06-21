import * as v from "valibot"

import type { Uri } from "../../types"
import type {
  DateTimeStamp,
  JsonLdContext,
  VcContext,
} from "../../types/shared/json-ld"
import { UriSchema } from "./uri"

/**
 * Generic JSON-LD context schema matching the `JsonLdContext` type.
 * Accepts a URI, an array of URIs, or an inline context object (map of string -> URI).
 * @see {@link https://www.w3.org/TR/json-ld/#contexts}
 */
export const JsonLdContextSchema = v.pipe(
  v.union([
    UriSchema,
    v.array(UriSchema),
    v.record(v.string(), v.union([UriSchema, v.string()])),
  ]),
  v.custom<JsonLdContext>(() => true),
)

/**
 * JSON-LD context schema.
 * @see {@link https://www.w3.org/TR/json-ld/#contexts}
 */
export function jsonLdContextSchema(
  context: Uri | Uri[],
  options?: { requireFirst?: boolean },
) {
  const requireFirst = options?.requireFirst ?? true
  const contexts = Array.isArray(context) ? context : [context]

  // Single string only allowed if there's exactly one required context.
  // Use v.pipe(UriSchema, v.check(...)) instead of v.literal to preserve
  // the Uri output type (v.literal widens template-literal types to string).
  const singleStringSchema =
    contexts.length === 1
      ? v.pipe(
          UriSchema,
          v.check((val: Uri) => val === contexts[0], `Must be ${contexts[0]}`),
        )
      : null

  const arrayContaining = v.pipe(
    v.array(UriSchema),
    v.check(
      (arr: Uri[]) =>
        (!requireFirst || arr[0] === contexts[0]) &&
        contexts.every((ctx) => arr.includes(ctx)),
      requireFirst
        ? `Array must start with ${contexts[0]} and contain all required contexts: ${contexts.join(", ")}`
        : `Array must contain all required contexts: ${contexts.join(", ")}`,
    ),
  )

  const validSchemas = singleStringSchema
    ? [singleStringSchema, arrayContaining]
    : [arrayContaining]

  return v.pipe(
    v.union(validSchemas),
    v.custom<VcContext>(() => true),
  )
}

/**
 * JSON-LD DateTimeStamp schema.
 * Must be a string in ISO 8601 format.
 * @see {@link https://www.w3.org/TR/json-ld/#datatypes}
 * @see {@link https://www.w3.org/TR/xmlschema11-2/#dateTime}
 */
export const DateTimeStampSchema = v.pipe(
  v.string(),
  v.regex(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?([+-]\d{2}:\d{2}|Z)$/,
    "Must be a valid ISO 8601 date-time string",
  ),
  v.custom<DateTimeStamp>(() => true),
)
