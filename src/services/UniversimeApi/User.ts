import axios from "axios";

import { ApiResponse } from "@/types/UniversimeApi";

const userApi = axios.create({
    baseURL: import.meta.env.VITE_UNIVERSIME_API,
    withCredentials: true,
});

export type UserSignUp_RequestDTO = {
    username: string;
    email:    string;
    password: string;
};

export type UserEdit_RequestDTO = {
    currentPassword: string;
    newPassword:     string;
};

export type UserSignUp_ResponseDTO = ApiResponse;
export type UserEdit_ResponseDTO =   ApiResponse;

export async function signUp(body: UserSignUp_RequestDTO) {
    return (await userApi.post<UserSignUp_ResponseDTO>("/signup", {
        username: body.username,
        email:    body.email,
        password: body.password,
    })).data;
}

export async function edit(body: UserEdit_RequestDTO) {
    return (await userApi.post<UserEdit_ResponseDTO>("/account/edit", {
        password: body.currentPassword,
        newPassword: body.newPassword,
    })).data;
}
