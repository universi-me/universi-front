import type { ApiResponse } from "@/types/UniversimeApi";
import type { User } from "@/types/User";
import { createApiInstance } from "./api";
import { Roles } from "@/types/Roles";

const api = createApiInstance("/")

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

export type GetAccount_ResponseDTO = ApiResponse<{ user: User, roles: Roles[] }>;
export type SignIn_ResponseDTO =     ApiResponse<{ user: User }>;
export type LogOut_ResponseDTO =     ApiResponse;

export async function validateToken() {
    const response = await getAccount();
    return response.body?.user ?? null;
}

export async function getAccount() {
    const response = await api.get<GetAccount_ResponseDTO>("/account");
    return response.data;
}

export async function signin({ username, password, recaptchaToken }: SignIn_RequestDTO) {
    const response = await api.post<SignIn_ResponseDTO>("/signin", { username, password, recaptchaToken });
    return response.data;
}

export async function logout() {
    const response = await api.get<LogOut_ResponseDTO>('/logout');
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