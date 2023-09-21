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

export type VideoAndFolder_RequestDTO = {
    folderId: string;
    videoIds: string | string[];
};

export type FolderGet_ResponseDTO =             ApiResponse<{ playlist: Folder }>;
export type FolderCreate_ResponseDTO =          ApiResponse;
export type FolderEdit_ResponseDTO =            ApiResponse;
export type FolderRemove_ResponseDTO =          ApiResponse;
export type ListVideosInFolder_ResponseDTO =    ApiResponse<{ videos: Content[] }>;
export type AddVideoToFolder_ResponseDTO =      ApiResponse;
export type RemoveVideoFromFolder_ResponseDTO = ApiResponse;

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

export async function videosInFolder(body: FolderId_RequestDTO) {
    return (await folderApi.post<ListVideosInFolder_ResponseDTO>("/videos", {
        id: body.id,
    })).data;
}

export async function addVideoToFolder(body: VideoAndFolder_RequestDTO) {
    return (await folderApi.post<AddVideoToFolder_ResponseDTO>("/video/add", {
        id:       body.folderId,
        videoIds: body.videoIds,
    })).data;
}

export async function removeVideoFromFolder(body: VideoAndFolder_RequestDTO) {
    return (await folderApi.post<RemoveVideoFromFolder_ResponseDTO>("/video/remove", {
        id:       body.folderId,
        videoIds: body.videoIds,
    })).data;
}
