import type { ApiResponse } from "@/types/UniversimeApi";
import * as SwalUtils from "@/utils/sweetalertUtils"
import axios from "axios";
import { goTo } from "@/services/routes";
import { LOGIN_REDIRECT_PARAM } from "@/pages/singin/Singin";

export const api = axios.create({
    baseURL: import.meta.env.VITE_UNIVERSIME_API,
    withCredentials: true,
});

api.interceptors.response.use(function (response) {
    if(response.data) {
        handleForResponseData(response.data, false, false)
    }
    return response;
}, function (error) {
    if(error.response && error.response.data) {
        handleForResponseData(error.response.data, true, true)
    }
    return error.response;
});

export const handleForResponseData = (response: ApiResponse<any>, isModalAsDefault: boolean, isError: boolean) => {
    // handle redirect
    if(response.redirectTo) {
        let redirectUrl = response.redirectTo;

        if (redirectUrl === "/login") {
            const currentURL = new URL(window.location.href);

            redirectUrl += `?${LOGIN_REDIRECT_PARAM}=` +
                encodeURIComponent(currentURL.searchParams.get(LOGIN_REDIRECT_PARAM) ?? location.href.substring(location.origin.length))
        }

        goTo(redirectUrl);
    }
    // handle alert
    if(response.message) {
        const alertOptions : any = {
            text: response.message,
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

