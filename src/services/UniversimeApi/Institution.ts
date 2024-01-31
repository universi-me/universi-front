import { ApiResponse } from "@/types/UniversimeApi";
import { api } from "./api";
import { Institution } from "@/types/Institution";

export type institutionGet_RequestDTO = {
    institutionId:   string;
}

export type InstitutionCreate_RequestDTO = {
    name: string;
    description: string;
}

export type InstitutionTypeGet_ResponseDTO = ApiResponse<{ institution: Institution }>;
export type InstitutionTypeList_ResponseDTO = ApiResponse<{ lista: Institution[] }>;
export type InstitutionCreate_ResponseDTO = ApiResponse<{  }>;

export async function get(body:institutionGet_RequestDTO) {
    return (await api.post<InstitutionTypeGet_ResponseDTO>("/curriculum/institution/obter", {
        institutionId: body.institutionId
    })).data;
}

export async function create(body: InstitutionCreate_RequestDTO) {
    return (await api.post<InstitutionCreate_ResponseDTO>("/curriculum/institution/criar", {
        name:         body.name,
        description:  body.description,
    })).data;
}


export async function list() {
    return (await api.post<InstitutionTypeList_ResponseDTO>("/curriculum/institution/listar", {})).data;
}
