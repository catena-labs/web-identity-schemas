import * as z from "zod"

/**
 * Create a schema that accepts either a single value or an array of values of
 * the given type, and always returns a flat array.
 * @example
 * ```ts
 * const schema = oneOrMany(z.string())
 * schema.parse("foo") // ["foo"]
 * schema.parse(["foo", "bar"]) // ["foo", "bar"]
 * schema.parse(["foo", ["bar", "baz"]]) // ["foo", "bar", "baz"]
 *
 * const numberSchema = oneOrMany(z.number())
 * numberSchema.parse(42) // [42]
 * numberSchema.parse([1, 2, 3]) // [1, 2, 3]
 * ```
 * @param schema - The schema for the individual values.
 * @returns A schema that accepts T or T[] and returns T[].
 */
export function oneOrMany<T extends z.ZodTypeAny>(schema: T) {
  return z
    .union([schema, z.array(schema)])
    .transform((val) => (Array.isArray(val) ? val : [val]))
}

/**
 * Create a schema that checks if the value includes all of the given values.
 * @example
 * ```ts
 * const schema = z.array(z.string()).refine(includesAll(["foo", "bar"]))
 * schema.parse(["foo", "bar"]) // ["foo", "bar"]
 * schema.parse(["foo", "bar", "baz"]) // ["foo", "bar", "baz"]
 * schema.parse(["foo"]) // Error (missing "bar")
 * schema.parse(["baz"]) // Error (missing "foo" and "bar")
 * ```
 * @param values - The values to check for.
 * @returns A refinement function that checks if the value includes all of the given values.
 */
export function includesAll<T extends string>(values: T[]) {
  return (val: T[]) => values.every((v) => val.includes(v))
}
