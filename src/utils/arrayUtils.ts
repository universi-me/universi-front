type Truthy<T> = T extends boolean ? true : NonNullable<T>;

export function removeFalsy<T>(arr: T[]): Truthy<T>[] {
    return arr.filter(v => !!v) as Truthy<T>[];
}
