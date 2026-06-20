import * as v from "valibot"

import type { Uri } from "../../types"
import type { DateTimeStamp, JsonLdContext } from "../../types/shared/json-ld"
import { UriSchema } from "./uri"

/**
 * JSON-LD context schema.
 * @see {@link https://www.w3.org/TR/json-ld/#contexts}
 */
export function jsonLdContextSchema(context: Uri | Uri[]) {
  const contexts = Array.isArray(context) ? context : [context]
  const literals = contexts.map(v.literal)

  // Single string only allowed if there's exactly one required context
  const singleStringSchema = contexts.length === 1 ? literals[0] : null

  const arrayContaining = v.pipe(
    v.array(UriSchema),
    v.check(
      (arr: Uri[]) =>
        arr[0] === contexts[0] && contexts.every((ctx) => arr.includes(ctx)),
      `Array must start with ${contexts[0]} and contain all required contexts: ${contexts.join(", ")}`,
    ),
  )

  // JSON-LD allows an inline context object (a map of string -> URI). Arrays are
  // handled by `arrayContaining`; this branch must not greedily match them.
  const recordSchema = v.custom<Record<string, Uri>>(
    (input) =>
      typeof input === "object" &&
      input !== null &&
      !Array.isArray(input) &&
      Object.values(input).every((value) => typeof value === "string"),
  )

  const validSchemas = singleStringSchema
    ? [singleStringSchema, arrayContaining, recordSchema]
    : [arrayContaining, recordSchema]

  return v.pipe(
    v.union(validSchemas),
    v.custom<JsonLdContext>(() => true),
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
