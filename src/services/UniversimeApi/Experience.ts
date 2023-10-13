import { Experience } from "@/types/Experience";
import { ApiResponse } from "@/types/UniversimeApi";
import { api } from "./api";

export type ExperienceCreate_RequestDTO = {
    typeExperienceId:   string;
    local:              string;
    description:        string;
    startDate:          string;
    endDate:            string;
    presentDate:        boolean;
}

export type ExperienceUpdate_RequestDTO = {
    experienceId:       string;
    typeExperienceId:   string;
    local:              string;
    description:        string;
    startDate:          string;
    endDate:            string;
    presentDate:        boolean;
}

export type ExperienceId_RequestDTO = {
    experienceId:       string;
}

export type ExperienceGet_ResponseDTO = ApiResponse <{ experience: Experience }>;
export type ExperienceCreate_ResponseDTO = ApiResponse;
export type ExperienceuUpdate_ResponseDTO = ApiResponse;
export type ExperienceRemove_ResponseDTO = ApiResponse;
export type ExperienceList_ResponseDTO = ApiResponse<{ lista: Experience[] }>;


export async function get(body:ExperienceId_RequestDTO) {
    return (await api.post<ExperienceCreate_ResponseDTO>("/curriculum/profileExperience", {
        experienceId: body.experienceId,
    })).data;
}

export async function create(body:ExperienceCreate_RequestDTO) {
    return (await api.post<ExperienceCreate_ResponseDTO>("/curriculum/profileExperience", {
        ejsxperienceTipoId:     body.typeExperienceId,
        local:                body.local,
        descricao:            body.description,
        dataInicial:          body.startDate,
        dataFinal:            body.endDate,
        dataPresente:         body.presentDate,
    })).data;
}

export async function update(body: ExperienceUpdate_RequestDTO) {
    return (await api.post<ExperienceCreate_ResponseDTO>("/curriculum/profileExperience", {
        experienceId:         body.experienceId,
        experienceTipoId:     body.typeExperienceId,
        local:                body.local,
        descricao:            body.description,
        dataInicial:          body.startDate,
        dataFinal:            body.endDate,
        dataPresente:         body.presentDate,
    })).data;
}

export async function remove(body:  ExperienceId_RequestDTO) {
    return (await api.post<ExperienceRemove_ResponseDTO>("/curriculum/profileExperience", {
        experienceId: body.experienceId,
    })).data;
}

export async function list() {
    return (await api.post<ExperienceList_ResponseDTO>('/curriculum/profileExperience', {})).data
}