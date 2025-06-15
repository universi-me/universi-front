type Nullable<T> = null | T;
type NullableBoolean = Nullable<boolean>;
type Optional<T> = T | undefined;
type Possibly<T> = T | null | undefined;
type Truthy<T> = T extends boolean ? true : NonNullable<T>;
type Merge<A, B> = A & Omit<B, keyof A>;
type Awaitable<T> = T | PromiseLike<T>;
type Predicate<T> = ( data: T ) => boolean;
