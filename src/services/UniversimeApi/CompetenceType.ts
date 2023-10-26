import type { CompetenceType } from "@/types/Competence";
import type { ApiResponse } from "@/types/UniversimeApi";
import { api } from "./api";

export type CompetenceTypeGet_RequestDTO = {
    competenceTypeId: string;
};

export type CompetenceTypeGet_ResponseDTO =  ApiResponse<{ competenceType: CompetenceType }>;
export type CompetenceTypeList_ResponseDTO = ApiResponse<{ list: CompetenceType[] }>;

export async function get(body: CompetenceTypeGet_RequestDTO) {
    return (await api.post<CompetenceTypeGet_ResponseDTO>("/competencetype/get", {
        competenceTypeId: body.competenceTypeId,
    })).data;
}

export async function list() {
    return (await api.post<CompetenceTypeList_ResponseDTO>("/competencetype/list", {})).data;
}
