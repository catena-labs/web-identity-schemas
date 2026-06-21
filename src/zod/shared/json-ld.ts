import * as z from "zod"

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
export const JsonLdContextSchema: z.ZodType<JsonLdContext> = z
  .union([
    UriSchema,
    z.array(UriSchema),
    z.record(z.string(), z.union([UriSchema, z.string()])),
  ])
  .pipe(z.custom<JsonLdContext>())

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
  const literals = contexts.map((c) => z.literal(c))

  // Single string only allowed if there's exactly one required context
  const singleStringSchema = contexts.length === 1 ? literals[0] : null

  const arrayContaining = z
    .array(UriSchema)
    .refine(
      (arr) =>
        (!requireFirst || arr[0] === contexts[0]) &&
        contexts.every((ctx) => arr.includes(ctx)),
      {
        message: requireFirst
          ? `Array must start with ${contexts[0]} and contain all required contexts: ${contexts.join(", ")}`
          : `Array must contain all required contexts: ${contexts.join(", ")}`,
      },
    )

  const validSchemas = singleStringSchema
    ? [singleStringSchema, arrayContaining]
    : [arrayContaining]

  return z.union(validSchemas).pipe(z.custom<VcContext>())
}

/**
 * JSON-LD DateTimeStamp schema.
 * Must be a string in ISO 8601 format.
 * @see {@link https://www.w3.org/TR/json-ld/#datatypes}
 * @see {@link https://www.w3.org/TR/xmlschema11-2/#dateTime}
 */
export const DateTimeStampSchema = z
  .string()
  .regex(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?([+-]\d{2}:\d{2}|Z)$/,
    "Must be a valid ISO 8601 date-time string",
  )
  .pipe(z.custom<DateTimeStamp>())
