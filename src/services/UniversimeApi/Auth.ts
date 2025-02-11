import { createApiInstance } from "./api";
import { ApiResponse } from "@/utils/apiUtils";

const api = createApiInstance("/")


export function signin( body: SignIn_RequestDTO ) {
    return api.post<SignIn_ResponseDTO>( "/signin", body ).then( ApiResponse.new );
}

export async function logout() {
    const response = await api.get<boolean>('/logout');
    return response.data;
}

export function login_google({ token }: GoogleSignIn_RequestDTO) {
    return api.post<SignIn_ResponseDTO>("/login/google", { token }).then( ApiResponse.new );
}

export function login_keycloak({ code }: KeyCloakSignIn_RequestDTO) {
    return api.post<SignIn_ResponseDTO>("/login/keycloak", { code }).then( ApiResponse.new );;
}

export function recoverPassword( body: RecoverPassword_RequestDTO ) {
    return api.post<undefined>( "/recovery-password", body ).then( ApiResponse.new );
}

export function newPassword( body: RecoverNewPassword_RequestDTO ) {
    return api.post<undefined>( "/new-password", body ).then( ApiResponse.new );
}

export type SignIn_RequestDTO = {
    username: string;
    password: string;
    recaptchaToken: string | null;
};

export type GoogleSignIn_RequestDTO = {
    token: string;
};

export type KeyCloakSignIn_RequestDTO = {
    code: string;
};

export type GetAccount_ResponseDTO = {
    user: User.DTO;
    roles: Role.DTO[]
};

export type SignIn_ResponseDTO = {
    user: User.DTO;
};

export type RecoverPassword_RequestDTO = {
    recaptchaToken: Optional<string>;
    username: string;
};

export type RecoverNewPassword_RequestDTO = {
    token: string;
    newPassword: string;
};
