import type { CompetenceType } from "@/types/Competence";
import type { ApiResponse } from "@/types/UniversimeApi";
import { createApiInstance } from "./api";

const api = createApiInstance( "/competencetype" )

export type CompetenceTypeGet_RequestDTO = {
    competenceTypeId: string;
};

export type CompetenceTypeCreate_RequestDTO = {
    name:   string;
};

export type CompetenceTypeUpdate_RequestDTO = {
    id:        string;
    name?:     string;
    reviewed?: boolean;
};

export type CompetenceTypeGet_ResponseDTO =  ApiResponse<{ competenceType: CompetenceType }>;
export type CompetenceTypeList_ResponseDTO = ApiResponse<{ list: CompetenceType[] }>;
export type CompetenceTypeCreate_ResponseDTO = ApiResponse;
export type CompetenceTypeUpdate_ResponseDTO = ApiResponse;

export async function get(body: CompetenceTypeGet_RequestDTO) {
    return (await api.post<CompetenceTypeGet_ResponseDTO>("/get", {
        competenceTypeId: body.competenceTypeId,
    })).data;
}

export async function create(body: CompetenceTypeCreate_RequestDTO) {
    return (await api.post<CompetenceTypeCreate_ResponseDTO>("/create", {
        name:         body.name,
    })).data;
}

export async function update(body: CompetenceTypeUpdate_RequestDTO) {
    return (await api.post<CompetenceTypeUpdate_ResponseDTO>("/admin/update", {
        competenceTypeId: body.id,
        name:             body.name,
        reviewed:         body.reviewed,
    })).data;
}

export async function list() {
    return (await api.post<CompetenceTypeList_ResponseDTO>("/list", {})).data;
}
