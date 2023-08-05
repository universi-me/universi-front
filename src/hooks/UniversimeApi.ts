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

    export namespace Profile {
        export async function get(profileId?: number, username?: string) {
            return (await api.post('/profile/get', { profileId, username })).data
        }

        export type ProfileEditBody = {
            profileId: string;
            name?: string;
            lastname?: string;
            bio?: string;
            sexo?: string;
        };
        export async function edit(body: ProfileEditBody) {
            return (await api.post('/profile/edit', body)).data
        }

        export async function groups(profileId?: number, username?: string) {
            return (await api.post('/profile/groups', {
                profileId: profileId?.toString(),
                username,
            })).data
        }

        export async function competences(profileId?: number, username?: string) {
            return (await api.post('/profile/competences', {
                profileId: profileId?.toString(),
                username,
            })).data
        }
    }

    export namespace Group {
        export async function get(groupId: string) {
            return (await api.post('/grupo/obter', {
                grupoId: groupId
            })).data;
        }
    }

    export namespace Competence {
        export async function list() {
            return (await api.post('/competencia/listar', {})).data
        }
    }
}
