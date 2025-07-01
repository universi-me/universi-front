export function arrayBufferToBinary(buf: ArrayBuffer): string {
    return new Uint8Array(buf)
        .reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
        );
}

export function arrayBufferToBase64(buf: ArrayBuffer): string {
    return !window
        ? Buffer.from(buf).toString('base64')    // Server-side
        : window.btoa(arrayBufferToBinary(buf)); // Client-side
}

const MEMORY_UNITS = [ "KB", "MB", "GB" ];
export function convertBytes( size: number, precision: number = 2 ): string {
    if ( size < 0 )
        return "-" + convertBytes( -size, precision );

    let unit = "B";
    for ( const memUnit of MEMORY_UNITS ) {
        if ( size < 1024 ) break;

        size /=1024;
        unit = memUnit;
    }

    return `${ size.toFixed( precision ) } ${ unit }`;
}
