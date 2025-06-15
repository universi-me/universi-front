export function dateWithoutTimezone( dateString: string | number ) {
    const date = new Date(dateString);
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000)
}
