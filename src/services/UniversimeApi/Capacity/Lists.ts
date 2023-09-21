import type { Category, Folder, Content } from "@/types/Capacity";
import type { ApiResponse } from "@/types/UniversimeApi";
import axios from "axios";

const capacityApi = axios.create({
    baseURL: `${import.meta.env.VITE_UNIVERSIME_API}/capacity`,
    withCredentials: true,
});

export type ContentList_ResponseDTO =  ApiResponse<{ contents: Content[] }>;
export type CategoryList_ResponseDTO = ApiResponse<{ categories: Category[] }>;
export type FolderList_ResponseDTO =   ApiResponse<{ folders: Folder[] }>;
export type ContentType_ResponseDTO =  ApiResponse<{ tipos: string[] }>;

export async function contentList() {
    return (await capacityApi.get<ContentList_ResponseDTO>("/videos")).data;
}

export async function categoryList() {
    return (await capacityApi.get<CategoryList_ResponseDTO>("/categories")).data;
}

export async function folderList() {
    return (await capacityApi.get<FolderList_ResponseDTO>("/playlists")).data;
}

export async function typeList(){
    return (await capacityApi.get<ContentType_ResponseDTO>("/contentTypes")).data
}
