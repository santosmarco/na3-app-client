export type MaybeArray<T> = T | T[];

export type NullableDeep<T> = T extends Record<PropertyKey, unknown>
  ? { [Key in keyof T]?: NullableDeep<T[Key]> }
  : T | null | undefined;

export type TypedChildren<Props> = MaybeArray<React.ReactElement<Props>>;

declare const emptyObject: unique symbol;
export type EmptyObject = { [emptyObject]?: never };
