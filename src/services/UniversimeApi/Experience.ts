import { Experience } from "@/types/Experience";
import { ApiResponse } from "@/types/UniversimeApi";
import { api } from "./api";

export type ExperienceCreate_RequestDTO = {
    typeExperienceId:   string;
    institutionId:            string;
    description:        string;
    startDate:          string;
    endDate:            string;
    presentDate:        boolean;
}

export type ExperienceUpdate_RequestDTO = {
    profileExperienceId:       string;
    typeExperienceId:   string;
    institutionId:            string;
    description:        string;
    startDate:          string;
    endDate:            string;
    presentDate:        boolean;
}

export type ExperienceId_RequestDTO = {
    profileExperienceId:       string;
}

export type ExperienceGet_ResponseDTO = ApiResponse <{ experience: Experience }>;
export type ExperienceCreate_ResponseDTO = ApiResponse;
export type ExperienceuUpdate_ResponseDTO = ApiResponse;
export type ExperienceRemove_ResponseDTO = ApiResponse;
export type ExperienceList_ResponseDTO = ApiResponse<{ lista: Experience[] }>;


export async function get(body:ExperienceId_RequestDTO) {
    return (await api.post<ExperienceCreate_ResponseDTO>("/curriculum/experience/obter", {
        profileExperienceId: body.profileExperienceId,
    })).data;
}

export async function create(body:ExperienceCreate_RequestDTO) {
    return (await api.post<ExperienceCreate_ResponseDTO>("/curriculum/experience/criar", body)).data;
}

export async function update(body: ExperienceUpdate_RequestDTO) {
    return (await api.post<ExperienceCreate_ResponseDTO>("/curriculum/experience/atualizar", body)).data;
}

export async function remove(body:  ExperienceId_RequestDTO) {
    return (await api.post<ExperienceRemove_ResponseDTO>("/curriculum/experience/remover", {
        profileExperienceId:            body.profileExperienceId,
    })).data;
}

export async function list() {
    return (await api.post<ExperienceList_ResponseDTO>('/curriculum/experience/listar', {})).data
}