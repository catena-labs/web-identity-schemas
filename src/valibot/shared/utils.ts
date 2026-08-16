import * as v from "valibot"

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
    v.transform((val) => (Array.isArray(val) ? val : [val])),
  )
}

/**
 * Create a record schema that rejects arrays.
 *
 * Valibot's `v.record()` accepts arrays, because an array is an object: the
 * array is rebuilt as a plain object with numeric string keys, silently
 * dropping its array-ness. Zod's `z.record()` rejects arrays outright, so an
 * unguarded `v.record()` makes the two implementations disagree.
 * @example
 * ```ts
 * const schema = plainRecord(v.string())
 * schema.parse({ a: "b" }) // { a: "b" }
 * schema.parse(["a"]) // Error (a bare v.record() would return { "0": "a" })
 * ```
 * @param value - The schema for the record's values.
 * @returns A record schema that accepts objects but not arrays.
 */
export function plainRecord<T>(value: v.GenericSchema<T>) {
  return v.pipe(
    v.custom<Record<string, T>>(
      (input) => !Array.isArray(input),
      "Expected an object but received an array",
    ),
    v.record(v.string(), value),
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
    (val: T[]) => values.every((value) => val.includes(value)),
    `Must include all of: ${values.join(", ")}`,
  )
}
