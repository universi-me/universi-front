import { ApiResponse } from "@/types/UniversimeApi";
import { api } from "./api";
import { Institution } from "@/types/Institution";

export type instituionGet_RequestDTO = {
    instituionId:   string;
}

export type InstitutionTypeGet_ResponseDTO = ApiResponse<{ instituion: Institution }>;
export type InstitutionTypeList_ResponseDTO = ApiResponse<{ list: Institution[] }>;

export async function get(body:instituionGet_RequestDTO) {
    return (await api.post<InstitutionTypeGet_ResponseDTO>("/curriculum/institution", {
        instituionId: body.instituionId,
    })).data;
}

export async function list() {
    return (await api.post("/curriculum/institution", {})).data;
}
