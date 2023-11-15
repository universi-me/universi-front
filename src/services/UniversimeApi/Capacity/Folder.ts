import type { Folder, Content } from "@/types/Capacity";
import type { ApiResponse } from "@/types/UniversimeApi";
import { api } from "../api";

export type FolderId_RequestDTO = {
    id: string;
};

export type FolderCreate_RequestDTO = {
    name:                string;
    image?:              string;
    description?:        string;
    rating?:             number;
    addCategoriesByIds?: string | string[];
    groupId?:            string;
    groupPath?:          string;
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

export type FolderGet_ResponseDTO =               ApiResponse<{ folder: Folder }>;
export type FolderCreate_ResponseDTO =            ApiResponse;
export type FolderEdit_ResponseDTO =              ApiResponse;
export type FolderRemove_ResponseDTO =            ApiResponse;
export type ListContentsInFolder_ResponseDTO =    ApiResponse<{ contents: Content[] }>;
export type AddContentToFolder_ResponseDTO =      ApiResponse;
export type RemoveContentFromFolder_ResponseDTO = ApiResponse;

export async function getFolder(body: FolderId_RequestDTO) {
    return (await api.post<FolderGet_ResponseDTO>("/capacity/folder/get", {
        id: body.id,
    })).data;
}

export async function createFolder(body: FolderCreate_RequestDTO) {
    return (await api.post<FolderCreate_ResponseDTO>("/capacity/folder/create", {
        name:               body.name,
        image:              body.image,
        description:        body.description,
        rating:             body.rating,
        addCategoriesByIds: body.addCategoriesByIds,
        groupId:            body.groupId,
        groupPath:          body.groupPath,
    })).data;
}

export async function editFolder(body: FolderEdit_RequestDTO) {
    return (await api.post<FolderEdit_ResponseDTO>("/capacity/folder/edit", {
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
    return (await api.post<FolderRemove_ResponseDTO>("/capacity/folder/delete", {
        id: body.id,
    })).data;
}

export async function contentsInFolder(body: FolderId_RequestDTO) {
    return (await api.post<ListContentsInFolder_ResponseDTO>("/capacity/folder/contents", {
        id: body.id,
    })).data;
}

export async function addContentToFolder(body: ContentAndFolder_RequestDTO) {
    return (await api.post<AddContentToFolder_ResponseDTO>("/capacity/folder/content/add", {
        id:         body.folderId,
        contentIds: body.contentIds,
    })).data;
}

export async function removeContentFromFolder(body: ContentAndFolder_RequestDTO) {
    return (await api.post<RemoveContentFromFolder_ResponseDTO>("/capacity/folder/content/remove", {
        id:         body.folderId,
        contentIds: body.contentIds,
    })).data;
}
