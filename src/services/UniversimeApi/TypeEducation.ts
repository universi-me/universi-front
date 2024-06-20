import { ApiResponse } from "@/types/UniversimeApi";
import { api } from "./api";
import { Institution } from "@/types/Institution";


export type typeEducation_RequestDTO = {
    typeEducationId: string;
}

export type ypeEducationCreate_RequestDTO = {
    name: string;
}

export type TypeEducationGet_ResponseDTO = ApiResponse<{ typeEducation: Institution }>;
export type TypeEducationList_ResponseDTO = ApiResponse<{lista: Institution[]}>;
export type ypeEducationCreate_ResponseDTO = ApiResponse<{  }>;

export async function get(body: typeEducation_RequestDTO) {
    return (await api.post<TypeEducationGet_ResponseDTO>("/curriculum/TypeEducation/obter", {
        typeEducationId: body.typeEducationId
    })).data;
}

export async function create(body: ypeEducationCreate_RequestDTO) {
    return (await api.post<ypeEducationCreate_ResponseDTO>("/curriculum/TypeEducation/criar", {
        name:         body.name,
    })).data;
}

export async function list() {
    return (await api.post<TypeEducationList_ResponseDTO>("/curriculum/TypeEducation/listar", {})).data;
}