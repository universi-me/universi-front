import * as Cookie from "cookie";

export const jwtTokenCookie = "JWT_TOKEN";


export function saveJwtToken( token: string ) {
    document.cookie = Cookie.serialize( jwtTokenCookie, token, { path: "/", secure: true } );
}

export function getJwtToken(): Optional<string> {
    return Cookie.parse( document.cookie )[ jwtTokenCookie ];
}

export function removeJwtToken() {
    document.cookie = Cookie.serialize( jwtTokenCookie, "", { expires: new Date(), path: "/" } );
}
