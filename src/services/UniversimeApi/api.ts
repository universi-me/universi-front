import * as Cookie from "cookie";
import type { ApiResponse } from "@/types/UniversimeApi";
import * as SwalUtils from "@/utils/sweetalertUtils"
import axios from "axios";
import { goTo } from "@/configs/routes";
import { LOGIN_REDIRECT_PARAM } from "@/pages/singin/Singin";
import { isApiError } from "@/utils/apiUtils";

const baseApiUrl = import.meta.env.VITE_UNIVERSIME_API;
export const jwtTokenCookie = "JWT_TOKEN";

export function createApiInstance( path: string ) {
    const api = axios.create({
        baseURL: `${baseApiUrl}${path}`,
        withCredentials: false,
    });

    api.interceptors.request.use( request => {
        const token = Cookie.parse( document.cookie )[ jwtTokenCookie ];
        request.headers.Authorization = `Bearer ${ token }`;
        return request;
    } );

    api.interceptors.response.use( response => {

        if(isApiError(response.data)) {
            handleForResponseData(response.data as any, true, true);
        }

        if ( response.data )
            handleForResponseData( response.data, false, false );

        

        return response;
    }, error => {
        if ( error?.response?.data )
            handleForResponseData( error.response.data, true, true );

        return error?.response;
    } );

    return api;
}


function handleForResponseData( response: ApiResponse<any>, isModalAsDefault: boolean, isError: boolean ) {
    // handle redirect
    if ( response.token ) {
        document.cookie = Cookie.serialize( jwtTokenCookie, response.token, { path: "/", secure: true } );
    }

    if(response.redirectTo) {
        let redirectUrl = response.redirectTo;

        if (redirectUrl === "/login") {
            const currentURL = new URL(window.location.href);

            redirectUrl += `?${LOGIN_REDIRECT_PARAM}=` +
                encodeURIComponent(currentURL.searchParams.get(LOGIN_REDIRECT_PARAM) ?? location.href.substring(location.origin.length))
        }

        goTo(redirectUrl);
    }

    var messageResp = response.message;
    
    if(isError) {
        var errors = (response as any).errors ?? [];
        if(errors.length > 0) {
            messageResp = messageResp ?? errors.join('<br>');
        }
    }

    // handle alert
    if(messageResp) {
        const alertOptions : any = {
            text: messageResp,
        };

        if(isError) {
            alertOptions.title = 'Ocorreu um Erro';
            alertOptions.icon = 'error';
        } else {
            alertOptions.icon = 'success';
            alertOptions.timer = 3000;
            alertOptions.timerProgressBar = true;
        }

        // control of alerts from API
        const alertOptionsToOverride = response.alertOptions ?? {};
        Object.keys(alertOptionsToOverride).map((key : any) => (
            alertOptions[key] = alertOptionsToOverride[key]
        ));

        const alertTypeModal = alertOptions.modalAlert ?? isModalAsDefault;
        if(alertTypeModal) {
            SwalUtils.fireModal(alertOptions);
        } else {
            SwalUtils.fireToasty(alertOptions);
        }
    }
}

