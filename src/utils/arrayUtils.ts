type Truthy<T> = T extends boolean ? true : NonNullable<T>;

export function removeFalsy<T>(arr: T[]): Truthy<T>[] {
    return arr.filter(v => !!v) as Truthy<T>[];
}

/** Returns a new array with all elements of `arr1` that are not in `arr2` according to `check` */
export function arrayRemoveEquals<T, K>(arr1: T[], arr2: K[], check?: (a: T, b: K) => boolean): T[] {
    const isEqual = check ?? Object.is;

    return arr1.filter(a => null == arr2.find(b => isEqual(a, b)));
}
