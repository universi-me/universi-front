import type { Category, Folder, Content } from "@/types/Capacity";
import type { ApiResponse } from "@/types/UniversimeApi";
import { api } from "../api";

export type ContentList_ResponseDTO =  ApiResponse<{ contents: Content[] }>;
export type CategoryList_ResponseDTO = ApiResponse<{ categories: Category[] }>;
export type FolderList_ResponseDTO =   ApiResponse<{ folders: Folder[] }>;
export type ContentType_ResponseDTO =  ApiResponse<{ tipos: string[] }>;

export async function contentList() {
    return (await api.get<ContentList_ResponseDTO>("/capacity/contents")).data;
}

export async function categoryList() {
    return (await api.get<CategoryList_ResponseDTO>("/capacity/categories")).data;
}

export async function folderList() {
    return (await api.get<FolderList_ResponseDTO>("/capacity/folders")).data;
}

export async function typeList(){
    return (await api.get<ContentType_ResponseDTO>("/capacity/contentTypes")).data
}
