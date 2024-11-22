import type { Education } from "@/types/Education";
import type { ApiResponse } from "@/types/UniversimeApi";
import { createApiInstance } from "./api";

const api = createApiInstance( "/curriculum/education" )

export type EducationCreate_RequestDTO = {
    typeEducationId:    string;
    institutionId:      string;
    startDate:          string;
    endDate:            string;
    presentDate:        boolean;
}

export type EducationUpdate_RequestDTO = {
    educationId:        string;
    typeEducationId:    string;
    institutionId:      string;
    startDate:          string;
    endDate:            string;
    presentDate:        boolean;
}

export type EducationId_RequestDTO = {
    educationId:        string;
}

export type EducationGet_ResponseDTO = ApiResponse<{ education: Education }>;
export type EducationCreate_ResponseDTO = ApiResponse;
export type EducationUpdate_ResponseDTO = ApiResponse;
export type EducationRemove_ResponseDTO = ApiResponse;
export type EducationList_ResponseDTO = ApiResponse<{ lista: Education[] }>;

export async function get(body:EducationId_RequestDTO) {
    return (await api.post<EducationCreate_ResponseDTO>("/obter", {
        educationId: body.educationId,
    })).data;
}

export async function create(body:EducationCreate_RequestDTO) {
    return (await api.post<EducationCreate_ResponseDTO>("/criar", {
        typeEducationId: body.typeEducationId,
        institutionId:   body.institutionId,
        startDate:       body.startDate,
        endDate:         body.endDate,
        presentDate:     body.presentDate,
    })).data;
}

export async function update(body: EducationUpdate_RequestDTO) {
    return (await api.post<EducationUpdate_ResponseDTO>(`/atualizar`, {
        educationId:     body.educationId,
        typeEducationId: body.typeEducationId,
        institutionId:   body.institutionId,
        startDate:       body.startDate,
        endDate:         body.endDate,
        presentDate:     body.presentDate,
    })).data;
}

export async function remove(body:  EducationId_RequestDTO) {
    return (await api.post<EducationRemove_ResponseDTO>("/remover", {
        educationId: body.educationId,
    })).data;
}

export async function list() {
    return (await api.post<EducationList_ResponseDTO>('/listar', {})).data
}
