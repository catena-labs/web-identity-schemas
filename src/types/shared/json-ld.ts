import type { Uri } from "./uri"

/**
 * JSON-LD context.
 * @see {@link https://www.w3.org/TR/json-ld/#contexts}
 */
export type JsonLdContext = Uri | Uri[] | Record<string, Uri>

/**
 * JSON-LD DateTimeStamp type.
 * Must be a string in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ).
 * @see {@link https://www.w3.org/TR/json-ld/#datatypes}
 * @see {@link https://www.w3.org/TR/xmlschema11-2/#dateTime}
 *
 * @example
 * "2023-12-07T10:30:00.000Z"
 * "2023-12-07T10:30:00.123Z"
 * "2023-12-07T10:30:00+01:00"
 */
export type DateTimeStamp = string
