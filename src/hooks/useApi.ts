import axios from "axios"

const api = axios.create(
    {
        baseURL: "http://localhost:8080/api",
        withCredentials: true,

    }
)

export const useApi = () => ({
    validateToken: async () => {
        const response = await api.get('/account');
        return response.data.body;
    },
    signin: async (username: string, password: string) => {
        const response = await api.post("/signin", { username, password });
        return response.data;

    },
    logout: async () => {
        return { status: true };
    },

    login_google: async (access_token: string) => {
        const response = await api.post("/login/google", { token: access_token });
        return response.data;
    }
});