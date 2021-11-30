export type MaybeArray<T> = T | T[];

export type NullableDeep<T> = T extends object
  ? { [Key in keyof T]?: NullableDeep<T[Key]> }
  : T | null | undefined;
