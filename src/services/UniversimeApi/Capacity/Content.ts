import type { Content } from "@/types/Capacity";
import type { ApiResponse } from "@/types/UniversimeApi";
import { api } from "../api";

export type ContentId_RequestDTO = {
    id: string;
};

export type ContentCreate_RequestDTO = {
    url:                 string;
    title:               string;
    description?:        string;
    type?:               string;
    addCategoriesByIds?: string | string[];
    addFoldersByIds?:    string | string[];
    rating?:             number;
    image?:              string;
};

export type ContentEdit_RequestDTO = {
    id:                     string;
    url?:                   string;
    title?:                 string;
    description?:           string;
    addCategoriesByIds?:    string | string[];
    removeCategoriesByIds?: string | string[];
    addFoldersByIds?:       string | string[];
    removeFoldersByIds?:    string | string[];
    rating?:                number;
    image?:                 string;
    type?:                  string;
};

export type ContentGet_ResponseDTO =    ApiResponse<{content: Content}>;
export type ContentCreate_ResponseDTO = ApiResponse;
export type ContentEdit_ResponseDTO =   ApiResponse;
export type ContentRemove_ResponseDTO = ApiResponse;

export async function getContent(body: ContentId_RequestDTO) {
    return (await api.post<ContentGet_ResponseDTO>("/capacity/content/get", {
        id: body.id,
    })).data;
}

export async function createContent(body: ContentCreate_RequestDTO) {
    return (await api.post<ContentCreate_ResponseDTO>("/capacity/content/create", {
        url:                body.url,
        title:              body.title,
        image:              body.image,
        description:        body.description,
        rating:             body.rating,
        type:               body.type,
        addCategoriesByIds: body.addCategoriesByIds,
        addFoldersByIds:    body.addFoldersByIds,
    })).data;
}

export async function editContent(body: ContentEdit_RequestDTO) {
    return (await api.post<ContentEdit_ResponseDTO>("/capacity/content/edit", {
        id:                    body.id,
        url:                   body.url,
        title:                 body.title,
        image:                 body.image,
        description:           body.description,
        rating:                body.rating,
        addCategoriesByIds:    body.addCategoriesByIds,
        removeCategoriesByIds: body.removeCategoriesByIds,
        addFoldersByIds:       body.addFoldersByIds,
        removeFoldersByIds:    body.removeFoldersByIds,
        type:                  body.type,
    })).data;
}

export async function removeContent(body: ContentId_RequestDTO) {
    return (await api.post<ContentRemove_ResponseDTO>("/capacity/content/delete", {
        id: body.id,
    })).data;
}
