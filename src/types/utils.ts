export type MaybeArray<T> = T | T[];

export type NullableDeep<T> = T extends Record<PropertyKey, unknown>
  ? { [Key in keyof T]?: NullableDeep<T[Key]> }
  : T | null | undefined;
