import { ApiResponse } from "@/utils/apiUtils";
import { createApiInstance } from "./api";

const api = createApiInstance( "/" )

export type UserSignUp_RequestDTO = {
    firstname: string;
    lastname:  string;
    username: string;
    email:    string;
    password: string;
    recaptchaToken: Nullable<string>;
};

export type UserEdit_RequestDTO = {
    password: string;
    newPassword: string;
};

export type UserRecoverPassword_RequestDTO = {
    username: string;
    recaptchaToken: string | null;
};

export type UserNewPassword_RequestDTO = {
    newPassword: string;
    token:    string | undefined;
};

export type UsernameAvailable_RequestDTO = {
    username: string;
};

export type EmailAvailable_RequestDTO = {
    email: string;
};

export function signUp(body: UserSignUp_RequestDTO) {
    return api.post<boolean>( "/signup", body ).then( ApiResponse.new );
}

export function edit(body: UserEdit_RequestDTO) {
    return api.post<undefined>( "/account", body ).then( ApiResponse.new );
}

export function recoverPassword(body : UserRecoverPassword_RequestDTO){
    return api.post<undefined>( "/recovery-password", body ).then( ApiResponse.new );
}

export function newPassword(body : UserNewPassword_RequestDTO){
    return api.post<undefined>( "/new-password", body ).then( ApiResponse.new );
}

export function usernameAvailable( username: string ){
    return api.post<GetAvailableCheck_ResponseDTO>(`/available/username/${username}`).then( ApiResponse.new );
}

export function emailAvailable( email: string ){
    return api.post<GetAvailableCheck_ResponseDTO>(`/available/email/${email}`).then( ApiResponse.new );
}

export type GetAvailableCheck_ResponseDTO = {
    available: boolean;
    reason: string;
};
