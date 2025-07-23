import * as v from "valibot"

/**
 * Transform a schema to accept both a single value and an array of values.
 * @example
 * ```ts
 * const schema = flatArray(v.string())
 * schema.parse("foo") // ["foo"]
 * schema.parse(["foo", "bar"]) // ["foo", "bar"]
 * ```
 * @param schema - The schema to transform.
 * @returns A new schema that accepts both a single value and an array of values.
 */
export function flatArray<T>(schema: v.GenericSchema<T>) {
  return v.pipe(
    schema,
    v.transform((val) => [val].flat() as T[])
  )
}

/**
 * Create a schema that accepts either a single value or an array of values of
 * the given type, and always returns a flat array.
 * @example
 * ```ts
 * const schema = oneOrMany(v.string())
 * schema.parse("foo") // ["foo"]
 * schema.parse(["foo", "bar"]) // ["foo", "bar"]
 * schema.parse(["foo", ["bar", "baz"]]) // ["foo", "bar", "baz"]
 *
 * const numberSchema = oneOrMany(v.number())
 * numberSchema.parse(42) // [42]
 * numberSchema.parse([1, 2, 3]) // [1, 2, 3]
 * ```
 * @param schema - The schema for the individual values.
 * @returns A schema that accepts T or T[] and returns T[].
 */
export function oneOrMany<T>(schema: v.GenericSchema<T>) {
  return v.pipe(
    v.union([schema, v.array(schema)]),
    v.transform((val) => [val].flat())
  )
}

/**
 * Create a schema that checks if the value includes all of the given values.
 * @example
 * ```ts
 * const schema = v.pipe(v.array(v.string()), includesAll(["foo", "bar"]))
 * schema.parse(["foo", "bar"]) // ["foo", "bar"]
 * schema.parse(["foo", "bar", "baz"]) // ["foo", "bar", "baz"]
 * schema.parse(["foo"]) // Error (missing "bar")
 * schema.parse(["baz"]) // Error (missing "foo" and "bar")
 * ```
 * @param values - The values to check for.
 * @returns A pipe method that checks if the value includes all of the given values.
 */
export function includesAll<T extends string>(values: T[]) {
  return v.check(
    (val: T[]) => values.every((v) => val.includes(v)),
    `Must include all of: ${values.join(", ")}`
  )
}
