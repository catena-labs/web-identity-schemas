import * as z from "zod"

/**
 * Used to ensure an object output satisfies a specific typescript type
 *
 * @example
 * ```ts
 * const schema: Shape<{ name: string }> = z.object({
 *   name: z.string()
 * })
 * ```
 */
export type Shape<TOutput> = z.ZodType<TOutput>
