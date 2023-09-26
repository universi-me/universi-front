import type { Competence } from "@/types/Competence";
import type { ApiResponse } from "@/types/UniversimeApi";
import { api } from "./api";

export type CompetenceCreate_RequestDTO = {
    competenceTypeId: string;
    description:      string;
    level:            string;
};

export type CompetenceUpdate_RequestDTO = {
    competenceId:     string;
    competenceTypeId: string;
    description:      string;
    level:            string;
};

export type CompetenceId_RequestDTO = {
    competenceId: string;
};

export type CompetenceGet_ResponseDTO =    ApiResponse<{ competencia: Competence }>;
export type CompetenceCreate_ResponseDTO = ApiResponse;
export type CompetenceUpdate_ResponseDTO = ApiResponse;
export type CompetenceRemove_ResponseDTO = ApiResponse;
export type CompetenceList_ResponseDTO =   ApiResponse<{ lista: Competence[] }>;

export async function get(body: CompetenceId_RequestDTO) {
    return (await api.post<CompetenceGet_ResponseDTO>("/competencia/obter", {
        competenciaId: body.competenceId,
    })).data;
}

export async function create(body: CompetenceCreate_RequestDTO) {
    return (await api.post<CompetenceCreate_ResponseDTO>("/competencia/criar", {
        competenciatipoId: body.competenceTypeId,
        descricao:         body.description,
        nivel:             body.level,
    })).data;
}

export async function update(body: CompetenceUpdate_RequestDTO) {
    return (await api.post<CompetenceUpdate_ResponseDTO>("/competencia/atualizar", {
        competenciaId:     body.competenceId,
        competenciaTipoId: body.competenceTypeId,
        descricao:         body.description,
        nivel:             body.level,
    })).data;
}

export async function remove(body: CompetenceId_RequestDTO) {
    return (await api.post<CompetenceRemove_ResponseDTO>("/competencia/remover", {
        competenciaId: body.competenceId,
    })).data;
}

export async function list() {
    return (await api.post<CompetenceList_ResponseDTO>('/competencia/listar', {})).data
}
