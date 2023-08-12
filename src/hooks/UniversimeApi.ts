import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_UNIVERSIME_API,
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
        export async function profile() {
            return (await api.get('/profile', {})).data
        }

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

        export async function links(profileId?: number, username?: string) {
            return (await api.post('/profile/links', {
                profileId: profileId?.toString(),
                username,
            })).data
        }

        export async function recommendations(profileId?: number, username?: string) {
            return (await api.post('/profile/recomendations', {
                profileId: profileId?.toString(),
                username,
            })).data
        }
    }

    export namespace Group {
        export async function get(groupId?: number, nickname?: string) {
            return (await api.post('/group/get', {
                groupId: groupId?.toString(),
                nickname,
            })).data;
        }

        export async function subgroups(groupId: number) {
            return (await api.post('/group/list', {
                groupId: groupId.toString(),
            })).data;
        }

        export async function participants(groupId: number) {
            return (await api.post('/group/participant/list', {
                groupId: groupId.toString(),
            })).data;
        }
    }

    export namespace Competence {
        export async function list() {
            return (await api.post('/competencia/listar', {})).data
        }

        export type CreateCompetenceDTO = {
            competenceTypeId: number;
            description:      string;
            level:            string;
        };
        export async function create(body: CreateCompetenceDTO) {
            return (await api.post("/competencia/criar", {
                competenciatipoId: body.competenceTypeId.toString(),
                descricao:         body.description,
                nivel:             body.level,
            })).data;
        }

        export type CompetenceUpdateDTO = {
            competenceId:     number;
            competenceTypeId: number;
            description:      string;
            level:            string;
        };
        export async function update(body: CompetenceUpdateDTO) {
            return (await api.post("/competencia/atualizar", {
                competenciaId:     body.competenceId.toString(),
                competenciaTipoId: body.competenceTypeId.toString(),
                descricao:         body.description,
                nivel:             body.level,
            })).data;
        }

        export async function remove(competenceId: number) {
            return (await api.post("/competencia/remover", {
                competenciaId: competenceId.toString(),
            })).data;
        }
    }

    export namespace CompetenceType {
        export async function list() {
            return (await api.post("/competencetype/list", {})).data;
        }
    }

    export namespace Link {
        export type LinkCreateDTO = {
            url: string;
            tipo: string;
            nome: string;
        };

        export async function create(body: LinkCreateDTO) {
            return (await api.post("/link/criar", body)).data;
        }

        export type LinkUpdateDTO = {
            linkId: string;
            url: string;
            tipo: string;
            nome: string;
        };
        export async function update(body: LinkUpdateDTO) {
            return (await api.post("/link/atualizar", body)).data;
        }

        export async function remove(linkId: string) {
            return (await api.post("/link/remover", {linkId})).data;
        }
    }
}
