import type { ApiResponse } from "@/types/UniversimeApi";
import { api } from "./api";
import { Vacancy } from "@/types/Vacancy";

export type VacancyCreate_RequestDTO = {
    typeVacancyId:          string;
    title:                  string;
    description:            string;
    prerequisites:          string;
    registrationDate:       string;
    endRegistrationDate:    string;
}

export type VacancyUpdate_RequestDTO = {
    vacancyId:              string;
    typeVacancyId:          string;
    title:                  string;
    description:            string;
    prerequisites:          string;
    registrationDate:       string;
    endRegistrationDate:    string;
}

export type VacancyId_RequestDTO = {
    vacancyId:        string;
}

export type VacancyGet_ResponseDTO = ApiResponse<{ vacancy: Vacancy }>;
export type VacancyCreate_ResponseDTO = ApiResponse;
export type VacancyUpdate_ResponseDTO = ApiResponse;
export type VacancyRemove_ResponseDTO = ApiResponse;
export type VacancyList_ResponseDTO = ApiResponse<{ lista: Vacancy[] }>;

export async function get(body:VacancyId_RequestDTO) {
    return (await api.post<VacancyCreate_ResponseDTO>("/vacancy/obter", {
        vacancyId: body.vacancyId,
    })).data;
}

export async function create(body:VacancyCreate_RequestDTO) {
    return (await api.post<VacancyCreate_ResponseDTO>("/vacancy/criar", {
        typeVacancyId:          body.typeVacancyId,
        title:                  body.title,
        description:            body.description,
        prerequisites:          body.prerequisites,
        registrationDate:       body.registrationDate,
        endRegistrationDate:    body.endRegistrationDate,
    })).data;
}

export async function update(body: VacancyUpdate_RequestDTO) {
    return (await api.put<VacancyUpdate_ResponseDTO>(`/vacancy/atualizar`, {
        id:                     body.vacancyId,
        typeVacancyId:          body.typeVacancyId,
        title:                  body.title,
        description:            body.description,
        prerequisites:          body.prerequisites,
        registrationDate:       body.registrationDate,
        endRegistrationDate:    body.endRegistrationDate,
    })).data;
}

export async function remove(body:  VacancyId_RequestDTO) {
    return (await api.post<VacancyRemove_ResponseDTO>("/vacancy/remover", {
        vacancyId: body.vacancyId,
    })).data;
}

export async function list() {
    return (await api.post<VacancyList_ResponseDTO>('/vacancy/listarActive', {})).data
}


