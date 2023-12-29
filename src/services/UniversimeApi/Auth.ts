import type { ApiResponse } from "@/types/UniversimeApi";
import type { User } from "@/types/User";
import { api } from "./api";

export type SignIn_RequestDTO = {
    username: string;
    password: string;
    recaptchaToken: string | null;
};

export type GoogleSignIn_RequestDTO = {
    token: string;
};

export type GetAccount_ResponseDTO = ApiResponse<{ user: User }>;
export type SignIn_ResponseDTO =     ApiResponse<{ user: User }>;
export type LogOut_ResponseDTO =     ApiResponse;

export async function validateToken() {
    const response = await api.get<GetAccount_ResponseDTO>('/account');
    return response.data.body?.user ?? null;
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
