import type { Uri } from "../../types"
import type { DateTimeStamp, JsonLdContext } from "../../types/shared/json-ld"
import * as v from "valibot"
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
      (arr: Uri[]) => contexts.every((ctx) => arr.includes(ctx)),
      `Array must contain all required contexts: ${contexts.join(", ")}`
    )
  )

  const recordSchema = v.record(v.string(), v.union([...literals, UriSchema]))

  const validSchemas = singleStringSchema
    ? [singleStringSchema, arrayContaining, recordSchema]
    : [arrayContaining, recordSchema]

  return v.pipe(
    v.union(validSchemas),
    v.custom<JsonLdContext>(() => true)
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
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?([+-]\d{2}:\d{2}|Z)$/,
    "Must be a valid ISO 8601 date-time string"
  ),
  v.custom<DateTimeStamp>(() => true)
)
