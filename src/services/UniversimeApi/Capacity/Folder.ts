import type { Folder, Content } from "@/types/Capacity";
import type { ApiResponse } from "@/types/UniversimeApi";
import axios from "axios";

const folderApi = axios.create({
    baseURL: `${import.meta.env.VITE_UNIVERSIME_API}/capacity/playlist`,
    withCredentials: true,
});

export type FolderId_RequestDTO = {
    id: string;
};

export type FolderCreate_RequestDTO = {
    name:                string;
    image?:              string;
    description?:        string;
    rating?:             number;
    addCategoriesByIds?: string | string[];
};

export type FolderEdit_RequestDTO = {
    id:                     string;
    name?:                  string;
    image?:                 string;
    description?:           string;
    rating?:                number;
    removeCategoriesByIds?: string | string[];
    addCategoriesByIds?:    string | string[];
};

export type ContentAndFolder_RequestDTO = {
    folderId:   string;
    contentIds: string | string[];
};

export type FolderGet_ResponseDTO =               ApiResponse<{ playlist: Folder }>;
export type FolderCreate_ResponseDTO =            ApiResponse;
export type FolderEdit_ResponseDTO =              ApiResponse;
export type FolderRemove_ResponseDTO =            ApiResponse;
export type ListContentsInFolder_ResponseDTO =    ApiResponse<{ videos: Content[] }>;
export type AddContentToFolder_ResponseDTO =      ApiResponse;
export type RemoveContentFromFolder_ResponseDTO = ApiResponse;

export async function getFolder(body: FolderId_RequestDTO) {
    return (await folderApi.post<FolderGet_ResponseDTO>("/get", {
        id: body.id,
    })).data;
}

export async function createFolder(body: FolderCreate_RequestDTO) {
    return (await folderApi.post<FolderCreate_ResponseDTO>("/create", {
        name:               body.name,
        image:              body.image,
        description:        body.description,
        rating:             body.rating,
        addCategoriesByIds: body.addCategoriesByIds,
    })).data;
}

export async function editFolder(body: FolderEdit_RequestDTO) {
    return (await folderApi.post<FolderEdit_ResponseDTO>("/edit", {
        id:                    body.id,
        name:                  body.name,
        image:                 body.image,
        description:           body.description,
        rating:                body.rating,
        removeCategoriesByIds: body.removeCategoriesByIds,
        addCategoriesByIds:    body.addCategoriesByIds,
    })).data;
}

export async function removeFolder(body: FolderId_RequestDTO) {
    return (await folderApi.post<FolderRemove_ResponseDTO>("/delete", {
        id: body.id,
    })).data;
}

export async function contentsInFolder(body: FolderId_RequestDTO) {
    return (await folderApi.post<ListContentsInFolder_ResponseDTO>("/videos", {
        id: body.id,
    })).data;
}

export async function addContentToFolder(body: ContentAndFolder_RequestDTO) {
    return (await folderApi.post<AddContentToFolder_ResponseDTO>("/video/add", {
        id:       body.folderId,
        videoIds: body.contentIds,
    })).data;
}

export async function removeContentFromFolder(body: ContentAndFolder_RequestDTO) {
    return (await folderApi.post<RemoveContentFromFolder_ResponseDTO>("/video/remove", {
        id:       body.folderId,
        videoIds: body.contentIds,
    })).data;
}
