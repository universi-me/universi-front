import type { Link } from "@/types/Link";
import type { ApiResponse } from "@/types/UniversimeApi";
import axios from "axios";

const linkApi = axios.create({
    baseURL: `${import.meta.env.VITE_UNIVERSIME_API}/link`,
    withCredentials: true,
});

export type LinkCreate_RequestDTO = {
    url:      string;
    linkType: string;
    name:     string;
};

export type LinkUpdate_RequestDTO = {
    linkId:   string;
    url:      string;
    linkType: string;
    name:     string;
};

export type LinkId_RequestDTO = {
    linkId: string;
}

export type LinkGet_ResponseDTO =    ApiResponse<{ link: Link }>;
export type LinkCreate_ResponseDTO = ApiResponse;
export type LinkUpdate_ResponseDTO = ApiResponse;
export type LinkRemove_ResponseDTO = ApiResponse;

export async function get(body: LinkId_RequestDTO) {
    return (await linkApi.post<LinkGet_ResponseDTO>("/obter", {
        linkId: body.linkId,
    })).data;
}

export async function create(body: LinkCreate_RequestDTO) {
    return (await linkApi.post<LinkCreate_ResponseDTO>("/criar", {
        url:  body.url,
        tipo: body.linkType,
        nome: body.name,
    })).data;
}

export async function update(body: LinkUpdate_RequestDTO) {
    return (await linkApi.post<LinkUpdate_ResponseDTO>("/atualizar", {
        linkId: body.linkId,
        url:    body.url,
        tipo:   body.linkType,
        nome:   body.name,
    })).data;
}

export async function remove(body: LinkId_RequestDTO) {
    return (await linkApi.post<LinkRemove_ResponseDTO>("/remover", {
        linkId: body.linkId,
    })).data;
}
