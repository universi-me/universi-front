import { Experience } from "@/types/Experience";
import { ApiResponse } from "@/types/UniversimeApi";
import { createApiInstance } from "./api";

const api = createApiInstance( "/curriculum/experience" )

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
    return (await api.post<ExperienceCreate_ResponseDTO>("/obter", {
        profileExperienceId: body.profileExperienceId,
    })).data;
}

export async function create(body:ExperienceCreate_RequestDTO) {
    return (await api.post<ExperienceCreate_ResponseDTO>("/criar", body)).data;
}

export async function update(body: ExperienceUpdate_RequestDTO) {
    return (await api.post<ExperienceCreate_ResponseDTO>("/atualizar", body)).data;
}

export async function remove(body:  ExperienceId_RequestDTO) {
    return (await api.post<ExperienceRemove_ResponseDTO>("/remover", {
        profileExperienceId:            body.profileExperienceId,
    })).data;
}

export async function list() {
    return (await api.post<ExperienceList_ResponseDTO>('/listar', {})).data
}