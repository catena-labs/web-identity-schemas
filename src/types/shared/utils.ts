/**
 * Array or single element type.
 */
export type OneOrMany<T> = T | T[]

/**
 * Extendable type that allows additional properties.
 */
export type LooseObject<T> = T & Record<string, unknown>

/**
 * Array containing utility type that requires specific elements in order.
 */
export type ArrayContaining<T extends readonly unknown[], TRest = unknown> = [
  ...T,
  ...TRest[]
]
