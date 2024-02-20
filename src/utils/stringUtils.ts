export function stringEqualsIgnoreCase(a: string, b: string): boolean {
    return a.toLocaleUpperCase().localeCompare(b.toLocaleUpperCase()) === 0;
}
