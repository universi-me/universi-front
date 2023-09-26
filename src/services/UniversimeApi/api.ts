import type { ApiResponse } from "@/types/UniversimeApi";
import * as SwalUtils from "@/utils/sweetalertUtils"
import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_UNIVERSIME_API,
    withCredentials: true,
});

api.interceptors.response.use(function (response) {
    if(response.data && response.data.message) {
        SwalUtils.fireToasty({
            text: response.data.message,
            icon: 'success',
            timer: 3000,
            timerProgressBar: true,
        });
    }
    return response;
}, function (error) {
    if(error.response && error.response.data && error.response.data.message) {
        SwalUtils.fireModal({
            title: "Ocorreu um Erro",
            text: error.response.data.message,
            icon: 'error',
        });
    }
    return error.response;
});
