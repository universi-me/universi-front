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
