import { ApiResponse } from "@/types/UniversimeApi";
import { api } from "./api";
import { Group } from "@/types/Group";

export type UserSignUp_RequestDTO = {
    username: string;
    email:    string;
    password: string;
};

export type UserEdit_RequestDTO = {
    currentPassword: string;
    newPassword:     string;
};

export type UserRecoverPassword_RequestDTO = {
    username: string;
};

export type UserNewPassword_RequestDTO = {
    password: string;
    token:    string | undefined;
};

export type UsernameAvailable_RequestDTO = {
    username: string;
};

export type UserSignUp_ResponseDTO = ApiResponse;
export type UserEdit_ResponseDTO =   ApiResponse;
export type UserOrganization_ResponseDTO = ApiResponse<{organization : Group}>

export async function signUp(body: UserSignUp_RequestDTO) {
    return (await api.post<UserSignUp_ResponseDTO>("/signup", {
        username: body.username,
        email:    body.email,
        password: body.password,
    })).data;
}

export async function edit(body: UserEdit_RequestDTO) {
    return (await api.post<UserEdit_ResponseDTO>("/account/edit", {
        password: body.currentPassword,
        newPassword: body.newPassword,
    })).data;
}

export async function recoverPassword(body : UserRecoverPassword_RequestDTO){
    return (await api.post<ApiResponse>("/recovery-password",{
        username: body.username,
    })).data;
}

export async function newPassword(body : UserNewPassword_RequestDTO){
    return (await api.post<ApiResponse>("/new-password", {
        newPassword: body.password,
        token: body.token,
    })).data;
}

export async function usernameAvailable(body : UsernameAvailable_RequestDTO){
    return (await api.post<ApiResponse>("/username-available",{
        username: body.username,
    })).data;
}

export async function organization(){
    return (await api.post<UserOrganization_ResponseDTO>("/group/current-organization", {
    })).data;
}