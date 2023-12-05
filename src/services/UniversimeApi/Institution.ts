import { ApiResponse } from "@/types/UniversimeApi";
import { api } from "./api";
import { Institution } from "@/types/Institution";

export type institutionGet_RequestDTO = {
    institutionId:   string;
}

export type InstitutionTypeGet_ResponseDTO = ApiResponse<{ institution: Institution }>;
export type InstitutionTypeList_ResponseDTO = Institution[];

export async function get(body:institutionGet_RequestDTO) {
    return (await api.post<InstitutionTypeGet_ResponseDTO>("/curriculum/institution/obter", {
        institutionId: body.institutionId
    })).data;
}

export async function list() {
    return (await api.get<InstitutionTypeList_ResponseDTO>("/curriculum/institution/listar")).data;
}
