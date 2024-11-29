export function stringEqualsIgnoreCase(a: string, b: string): boolean {
    return a.toLocaleUpperCase().localeCompare(b.toLocaleUpperCase()) === 0;
}

export function stringIncludesIgnoreCase(outer: string, inner: string): boolean {
    return outer.toLocaleUpperCase().includes(inner.toLocaleUpperCase());
}

export default {
    equalsIgnoreCase: stringEqualsIgnoreCase,
    includesIgnoreCase: stringIncludesIgnoreCase,
};
