import axios from "axios";

const linkApi = axios.create({
    baseURL: `${import.meta.env.VITE_UNIVERSIME_API}/link`,
    withCredentials: true,
});

export type LinkCreateDTO = {
    url:      string;
    linkType: string;
    name:     string;
};

export type LinkUpdateDTO = {
    linkId:   number;
    url:      string;
    linkType: string;
    name:     string;
};

export type LinkIdDTO = {
    linkId: number;
}

export async function create(body: LinkCreateDTO) {
    return (await linkApi.post("/criar", {
        url:  body.url,
        tipo: body.linkType,
        nome: body.name,
    })).data;
}

export async function update(body: LinkUpdateDTO) {
    return (await linkApi.post("/atualizar", {
        linkId: body.linkId.toString(),
        url:    body.url,
        tipo:   body.linkType,
        nome:   body.name,
    })).data;
}

export async function remove(body: LinkIdDTO) {
    return (await linkApi.post("/remover", {
        linkId: body.linkId.toString(),
    })).data;
}
