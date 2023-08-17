import axios from "axios";

const linkApi = axios.create({
    baseURL: `${import.meta.env.VITE_UNIVERSIME_API}/link`,
    withCredentials: true,
});

export type LinkCreateDTO = {
    url: string;
    tipo: string;
    nome: string;
};

export async function create(body: LinkCreateDTO) {
    return (await linkApi.post("/criar", body)).data;
}

export type LinkUpdateDTO = {
    linkId: string;
    url: string;
    tipo: string;
    nome: string;
};
export async function update(body: LinkUpdateDTO) {
    return (await linkApi.post("/atualizar", body)).data;
}

export async function remove(linkId: string) {
    return (await linkApi.post("/remover", {linkId})).data;
}
