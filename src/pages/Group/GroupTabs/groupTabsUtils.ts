import { dateWithoutTimezone } from "@/utils/dateUtils";

export function formatActivityDate( start: string, end?: string ): string {
    if ( end === undefined || start === end )
        return dateWithoutTimezone( start ).toLocaleDateString( "pt-BR" );

    else
        return `${ formatActivityDate( start ) } – ${ formatActivityDate( end ) }`
}
