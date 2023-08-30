import type { ApiResponse } from "@/types/UniversimeApi";
import type { User } from "@/types/User";
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_UNIVERSIME_API,
    withCredentials: true,
});

export type SignIn_RequestDTO = {
    username: string;
    password: string;
};

export type GoogleSignIn_RequestDTO = {
    token: string;
};

export type GetAccount_ResponseDTO = ApiResponse<{ user: User }>;
export type SignIn_ResponseDTO =     ApiResponse<{ user: User }>;
export type LogOut_ResponseDTO =     ApiResponse;

export async function validateToken() {
    const response = await api.get<GetAccount_ResponseDTO>('/account');
    return response.data.body;
}

export async function signin({ username, password }: SignIn_RequestDTO) {
    const response = await api.post<SignIn_ResponseDTO>("/signin", { username, password });
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
