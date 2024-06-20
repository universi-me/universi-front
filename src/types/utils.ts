export type Nullable<T> = null | T;
export type NullableBoolean = Nullable<boolean>;
export type Optional<T> = T | undefined;
export type PossiblePromise<T> = T | Promise<T>;
