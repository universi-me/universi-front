import type { Category, Video } from "@/types/Capacity";
import type { ApiResponse } from "@/types/UniversimeApi";
import axios from "axios";

const categoryApi = axios.create({
    baseURL: `${import.meta.env.VITE_UNIVERSIME_API}/capacity/category`,
    withCredentials: true,
});

export type CategoryId_RequestDTO = {
    id: string;
};

export type CategoryCreate_RequestDTO = {
    name:  string;
    image: string;
};

export type CategoryEdit_RequestDTO = {
    id:     string;
    name?:  string;
    image?: string;
};

export type CategoryGet_ResponseDTO =          ApiResponse<{ category: Category }>;
export type CategoryCreate_ResponseDTO =       ApiResponse;
export type CategoryEdit_ResponseDTO =         ApiResponse;
export type CategoryRemove_ResponseDTO =       ApiResponse;
export type ListVideosInCategory_ResponseDTO = ApiResponse<{ videos: Video[] }>;

export async function getCategory(body: CategoryId_RequestDTO) {
    return (await categoryApi.post<CategoryGet_ResponseDTO>("/get", {
        id: body.id,
    })).data;
}

export async function createCategory(body: CategoryCreate_RequestDTO) {
    return (await categoryApi.post<CategoryCreate_ResponseDTO>("/create", {
        name:  body.name,
        image: body.image,
    })).data;
}

export async function editCategory(body: CategoryEdit_RequestDTO) {
    return (await categoryApi.post<CategoryEdit_ResponseDTO>("/edit", {
        id:    body.id,
        name:  body.name,
        image: body.image,
    })).data;
}

export async function removeCategory(body: CategoryId_RequestDTO) {
    return (await categoryApi.post<CategoryRemove_ResponseDTO>("/delete", {
        id: body.id,
    })).data;
}

export async function videosInCategory(body: CategoryId_RequestDTO) {
    return (await categoryApi.post<ListVideosInCategory_ResponseDTO>("/videos", {
        id: body.id,
    })).data;
}
