import { createApiInstance } from "./api";
import { ApiResponse } from "@/utils/apiUtils";

const api = createApiInstance("/")


export function getAccount() {
    return api.get<GetAccount_ResponseDTO>("/account").then( ApiResponse.new );
}

export function signin( body: SignIn_RequestDTO ) {
    return api.post<SignIn_ResponseDTO>( "/signin", body ).then( ApiResponse.new );
}

export async function logout() {
    const response = await api.get<boolean>('/logout');
    return response.data;
}

export async function login_google({ token }: GoogleSignIn_RequestDTO) {
    const response = await api.post<SignIn_ResponseDTO>("/login/google", { token });
    return response.data;
}

export async function login_keycloak({ code }: KeyCloakSignIn_RequestDTO) {
    const response = await api.post<SignIn_ResponseDTO>("/login/keycloak", { code });
    return response.data;
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
