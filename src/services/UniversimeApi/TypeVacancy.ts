import { TypeVacancy } from "@/types/TypeVacancy";
import { ApiResponse } from "@/types/UniversimeApi";
import { api } from "./api";



export type typeVacancy_RequestDTO = {
    typeVacancyId: string;
}

export type TypeVacancyGet_ResponseDTO = ApiResponse<{ typeVacancy: TypeVacancy }>;
export type TypeVacancyList_ResposeDT0 = TypeVacancy [];

export async function get(body: typeVacancy_RequestDTO) {
    return (await api.post<TypeVacancyGet_ResponseDTO>("/typeVacancy", {
        typeVacancyId: body.typeVacancyId
    })).data;
}

export async function list() {
    return (await api.get<TypeVacancyList_ResposeDT0>("/typeVacancy", {})).data;
}