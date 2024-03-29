import type { CompetenceType } from "@/types/Competence";
import type { ApiResponse } from "@/types/UniversimeApi";
import { api } from "./api";

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

export type CompetenceTypeRemove_RequestDTO = {
    id: string;
};

export type CompetenceTypeMerge_RequestDTO = {
    removedCompetenceTypeId:   string;
    remainingCompetenceTypeId: string;
};

export type CompetenceTypeGet_ResponseDTO =  ApiResponse<{ competenceType: CompetenceType }>;
export type CompetenceTypeList_ResponseDTO = ApiResponse<{ list: CompetenceType[] }>;
export type CompetenceTypeCreate_ResponseDTO = ApiResponse;
export type CompetenceTypeUpdate_ResponseDTO = ApiResponse;
export type CompetenceTypeMerge_ResponseDTO =  ApiResponse;
export type CompetenceTypeRemove_ResponseDTO = ApiResponse;

export async function get(body: CompetenceTypeGet_RequestDTO) {
    return (await api.post<CompetenceTypeGet_ResponseDTO>("/competencetype/get", {
        competenceTypeId: body.competenceTypeId,
    })).data;
}

export async function create(body: CompetenceTypeCreate_RequestDTO) {
    return (await api.post<CompetenceTypeCreate_ResponseDTO>("/competencetype/create", {
        name:         body.name,
    })).data;
}

export async function update(body: CompetenceTypeUpdate_RequestDTO) {
    return (await api.post<CompetenceTypeUpdate_ResponseDTO>("/admin/competencetype/update", {
        competenceTypeId: body.id,
        name:             body.name,
        reviewed:         body.reviewed,
    })).data;
}

export async function list() {
    return (await api.post<CompetenceTypeList_ResponseDTO>("/competencetype/list", {})).data;
}

export async function remove(body: CompetenceTypeRemove_RequestDTO) {
    return (await api.post<CompetenceTypeRemove_ResponseDTO>("/admin/competencetype/remove", {
        competenceTypeId: body.id,
    })).data;
}

export async function merge(body: CompetenceTypeMerge_RequestDTO) {
    return (await api.post<CompetenceTypeMerge_ResponseDTO>("/admin/competencetype/merge", {
        removedCompetenceTypeId:   body.removedCompetenceTypeId,
        remainingCompetenceTypeId: body.remainingCompetenceTypeId,
    })).data;
}
