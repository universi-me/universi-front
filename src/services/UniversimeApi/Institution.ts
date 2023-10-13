import { ApiResponse } from "@/types/UniversimeApi";
import { api } from "./api";
import { Institution } from "@/types/Institution";

export type instituionGet_RequestDTO = {
    institutionId:   string;
}

export type InstitutionTypeGet_ResponseDTO = ApiResponse<{ instituion: Institution }>;
export type InstitutionTypeList_ResponseDTO = Institution[];

export async function get(body:instituionGet_RequestDTO) {
    return (await api.post<InstitutionTypeGet_ResponseDTO>("/curriculum/institution", {
        institutionId: body.institutionId,
    })).data;
}

export async function list() {
    return (await api.get<InstitutionTypeList_ResponseDTO>("/curriculum/institution")).data;
}
