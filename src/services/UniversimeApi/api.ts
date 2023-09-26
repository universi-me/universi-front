import type { ApiResponse } from "@/types/UniversimeApi";
import * as SwalUtils from "@/utils/sweetalertUtils"
import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_UNIVERSIME_API,
    withCredentials: true,
});

api.interceptors.response.use(function (response) {
    if(response.data && response.data.message) {
        showAlertForResponseData(response.data, false, false)
    }
    return response;
}, function (error) {
    if(error.response && error.response.data && error.response.data.message) {
        showAlertForResponseData(error.response.data, true, true)
    }
    return error.response;
});

export const showAlertForResponseData = (response: ApiResponse<any>, isModalAsDefault: boolean, isError: boolean) => {
    if(response && response.message) {
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

        const alertTypeModal = response.alertType ?? isModalAsDefault;
        if(alertTypeModal) {
            SwalUtils.fireModal(alertOptions);
        } else {
            SwalUtils.fireToasty(alertOptions);
        }
    }
}

