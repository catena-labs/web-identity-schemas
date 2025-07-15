import * as v from "valibot"

/**
 * Used to ensure an object output satisfies a specific typescript type
 *
 * @example
 * ```ts
 * const schema: Shaped<{ name: string }> = v.object({
 *   name: v.string()
 * })
 * ```
 */
export type Shaped<TOutput> = v.GenericSchema<unknown, TOutput>

/**
 * Used to ensure an object output satisfies a specific typescript type
 */
export type Shape<TOutput> = {
  [TKey in keyof TOutput]-?: v.GenericSchema<unknown, TOutput[TKey]>
}
