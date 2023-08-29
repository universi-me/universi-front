import { Video } from "@/types/Capacity";
import { ApiResponse } from "@/types/UniversimeApi";
import axios from "axios";

const videoApi = axios.create({
    baseURL: `${import.meta.env.VITE_UNIVERSIME_API}/capacity/video`,
    withCredentials: true,
});

export type VideoId_RequestDTO = {
    id: string;
};

export type VideoCreate_RequestDTO = {
    url:                 string;
    title:               string;
    description?:        string;
    addCategoriesByIds?: string | string[];
    addPlaylistsByIds?:  string | string[];
    rating?:             number;
    image?:              string;
};

export type VideoEdit_RequestDTO = {
    id:                     string;
    url?:                   string;
    title?:                 string;
    description?:           string;
    addCategoriesByIds?:    string | string[];
    removeCategoriesByIds?: string | string[];
    addPlaylistsByIds?:     string | string[];
    removePlaylistsByIds?:  string | string[];
    rating?:                number;
    image?:                 string;
};

export type VideoGet_ResponseDTO =    ApiResponse<{video: Video}>;
export type VideoCreate_ResponseDTO = ApiResponse<undefined>;
export type VideoEdit_ResponseDTO =   ApiResponse<undefined>;
export type VideoRemove_ResponseDTO = ApiResponse<undefined>;

export async function getVideo(body: VideoId_RequestDTO) {
    return (await videoApi.post<VideoGet_ResponseDTO>("/get", {
        id: body.id,
    })).data;
}

export async function createVideo(body: VideoCreate_RequestDTO) {
    return (await videoApi.post<VideoCreate_ResponseDTO>("/create", {
        url:                body.url,
        title:              body.title,
        image:              body.image,
        description:        body.description,
        rating:             body.rating,
        addCategoriesByIds: body.addCategoriesByIds,
        addPlaylistsByIds:  body.addPlaylistsByIds,
    })).data;
}

export async function editVideo(body: VideoEdit_RequestDTO) {
    return (await videoApi.post<VideoEdit_ResponseDTO>("/edit", {
        id:                    body.id,
        url:                   body.url,
        title:                 body.title,
        image:                 body.image,
        description:           body.description,
        rating:                body.rating,
        addCategoriesByIds:    body.addCategoriesByIds,
        removeCategoriesByIds: body.removeCategoriesByIds,
        addPlaylistsByIds:     body.addPlaylistsByIds,
        removePlaylistsByIds:  body.removePlaylistsByIds,
    })).data;
}

export async function removeVideo(body: VideoId_RequestDTO) {
    return (await videoApi.post<VideoRemove_ResponseDTO>("/delete", {
        id: body.id,
    })).data;
}
