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

export async function get(body: LinkId_RequestDTO | Link) {
    return (await linkApi.post<LinkGet_ResponseDTO>("/obter", {
        linkId: 'linkId' in body ? body.linkId : body.id,
    })).data;
}

export async function create(body: LinkCreate_RequestDTO | Link): Promise<LinkCreate_ResponseDTO> {
    return (await linkApi.post<LinkCreate_ResponseDTO>("/criar", {
        url:  body.url,
        tipo: 'typeLink' in body ? body.typeLink : body.linkType,
        nome: body.name,
    })).data;
}

export async function update(body: LinkUpdate_RequestDTO | Link): Promise<LinkUpdate_ResponseDTO> {
    return (await linkApi.post<LinkUpdate_ResponseDTO>("/atualizar", {
        linkId: 'linkId' in body ? body.linkId : body.id,
        url:    body.url,
        tipo:   'linkType' in body ? body.linkType : body.typeLink,
        nome:   body.name,
    })).data;
}

export async function remove(body: LinkId_RequestDTO | Link): Promise<LinkRemove_ResponseDTO> {
    return (await linkApi.post<LinkRemove_ResponseDTO>("/remover", {
        linkId: 'linkId' in body ? body.linkId : body.id,
    })).data;
}
