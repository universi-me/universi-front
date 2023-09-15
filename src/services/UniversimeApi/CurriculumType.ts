import type { ComponentType } from "@/types/CurriculumComp";
import type { ApiResponse } from "@/types/UniversimeApi";
import axios from "axios";

const ComponentTypeApi = axios.create({
    baseURL: `${import.meta.env.VITE_UNIVERSIME_API}/componentType`,
    withCredentials: true,
});

export type ComponentTypeGet_RequestDTO = {
    ComponentTypeId: string;
    name: string;
};

export type ComponentTypeGet_ResponseDTO =  ApiResponse<{ ComponentType: ComponentType }>;
export type ComponentTypeList_ResponseDTO = ApiResponse<{ list: ComponentType[] }>;

export async function get(param: ComponentTypeGet_ResponseDTO) {
    return (
        await ComponentTypeApi.get<ComponentTypeGet_ResponseDTO, ComponentTypeList_ResponseDTO>
            ("/get")
    );
}

export async function list() {
    return (await ComponentTypeApi.get<ComponentTypeList_ResponseDTO, ComponentType>(''));
}
