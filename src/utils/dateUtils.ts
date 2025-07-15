export function dateWithoutTimezone( dateString: string | number ) {
    const date = new Date(dateString);
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000)
}

export function getDate( date: undefined | null ): undefined;
export function getDate( date: Date | string | number ): Date;
export function getDate( date: Date | string | number | undefined | null ): Optional<Date>;
export function getDate( date: Date | string | number | undefined | null ): Optional<Date> {
    if ( date instanceof Date )
        return date;

    else if ( date === undefined || date === null )
        return undefined;

    else
        return dateWithoutTimezone( date );
}
