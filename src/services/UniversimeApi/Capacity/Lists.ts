import type { Category, Folder, Content } from "@/types/Capacity";
import type { ApiResponse } from "@/types/UniversimeApi";
import axios from "axios";

const capacityApi = axios.create({
    baseURL: `${import.meta.env.VITE_UNIVERSIME_API}/capacity`,
    withCredentials: true,
});

export type VideoList_ResponseDTO =    ApiResponse<{ videos: Content[] }>;
export type CategoryList_ResponseDTO = ApiResponse<{ categories: Category[] }>;
export type PlaylistList_ResponseDTO = ApiResponse<{ playlists: Folder[] }>;
export type ContentType_ResponseDTO =  ApiResponse<{ tipos: string[] }>;

export async function videoList() {
    return (await capacityApi.get<VideoList_ResponseDTO>("/videos")).data;
}

export async function categoryList() {
    return (await capacityApi.get<CategoryList_ResponseDTO>("/categories")).data;
}

export async function playlistList() {
    return (await capacityApi.get<PlaylistList_ResponseDTO>("/playlists")).data;
}

export async function typeList(){
    return (await capacityApi.get<ContentType_ResponseDTO>("/contentTypes")).data
}
