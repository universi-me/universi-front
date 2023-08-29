import type { Playlist, Video } from "@/types/Capacity";
import type { ApiResponse } from "@/types/UniversimeApi";
import axios from "axios";

const playlistApi = axios.create({
    baseURL: `${import.meta.env.VITE_UNIVERSIME_API}/capacity/playlist`,
    withCredentials: true,
});

export type PlaylistId_RequestDTO = {
    id: string;
};

export type PlaylistCreate_RequestDTO = {
    name:                string;
    image?:              string;
    description?:        string;
    rating?:             number;
    addCategoriesByIds?: string | string[];
};

export type PlaylistEdit_RequestDTO = {
    id:                     string;
    name?:                  string;
    image?:                 string;
    description?:           string;
    rating?:                number;
    removeCategoriesByIds?: string | string[];
    addCategoriesByIds?:    string | string[];
};

export type VideoAndPlaylist_RequestDTO = {
    playlistId: string;
    videoIds:   string | string[];
};

export type PlaylistGet_ResponseDTO =             ApiResponse<{ playlist: Playlist }>;
export type PlaylistCreate_ResponseDTO =          ApiResponse<undefined>;
export type PlaylistEdit_ResponseDTO =            ApiResponse<undefined>;
export type PlaylistRemove_ResponseDTO =          ApiResponse<undefined>;
export type ListVideosInPlaylist_ResponseDTO =    ApiResponse<{ videos: Video[] }>;
export type AddVideoToPlaylist_ResponseDTO =      ApiResponse<undefined>;
export type RemoveVideoFromPlaylist_ResponseDTO = ApiResponse<undefined>;

export async function getPlaylist(body: PlaylistId_RequestDTO) {
    return (await playlistApi.post<PlaylistGet_ResponseDTO>("/get", {
        id: body.id,
    })).data;
}

export async function createPlaylist(body: PlaylistCreate_RequestDTO) {
    return (await playlistApi.post<PlaylistCreate_ResponseDTO>("/create", {
        name:               body.name,
        image:              body.image,
        description:        body.description,
        rating:             body.rating,
        addCategoriesByIds: body.addCategoriesByIds,
    })).data;
}

export async function editPlaylist(body: PlaylistEdit_RequestDTO) {
    return (await playlistApi.post<PlaylistEdit_ResponseDTO>("/edit", {
        id:                    body.id,
        name:                  body.name,
        image:                 body.image,
        description:           body.description,
        rating:                body.rating,
        removeCategoriesByIds: body.removeCategoriesByIds,
        addCategoriesByIds:    body.addCategoriesByIds,
    })).data;
}

export async function removePlaylist(body: PlaylistId_RequestDTO) {
    return (await playlistApi.post<PlaylistRemove_ResponseDTO>("/delete", {
        id: body.id,
    })).data;
}

export async function videosInPlaylist(body: PlaylistId_RequestDTO) {
    return (await playlistApi.post<ListVideosInPlaylist_ResponseDTO>("/videos", {
        id: body.id,
    })).data;
}

export async function addVideoToPlaylist(body: VideoAndPlaylist_RequestDTO) {
    return (await playlistApi.post<AddVideoToPlaylist_ResponseDTO>("/video/add", {
        id:      body.playlistId,
        videoIds: body.videoIds,
    })).data;
}

export async function removeVideoFromPlaylist(body: VideoAndPlaylist_RequestDTO) {
    return (await playlistApi.post<RemoveVideoFromPlaylist_ResponseDTO>("/video/remove", {
        id:      body.playlistId,
        videoIds: body.videoIds,
    })).data;
}
