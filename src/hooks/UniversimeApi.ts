import axios from "axios"

const api = axios.create({
    // todo: change to online API on production
    baseURL: "http://localhost:8080/api",
    withCredentials: true,
})

export namespace UniversimeApi {
    export async function validateToken() {
        const response = await api.get('/account');
        return response.data.body;
    }

    export async function signin(username: string, password: string) {
        const response = await api.post("/signin", { username, password });
        return response.data;
    }

    export async function logout() {
        return { status: true };
    }

    export async function login_google(access_token: string) {
        const response = await api.post("/login/google", { token: access_token });
        return response.data;
    }
}
