import { ApiResponse } from "@/types/UniversimeApi";
import { api } from "./api";
import { TypeExperience } from "@/types/TypeExperience";

export type typeExperience_RequestDTO = {
    typeExperienceId: string;
}

export type TypeExperienceGet_ResponseDTO = ApiResponse<{ typeEducation: TypeExperience }>;
export type TypeExperienceList_ResponseDTO = ApiResponse<{ lista: TypeExperience[] }>;

export async function get(body: typeExperience_RequestDTO) {
    return (await api.post<TypeExperienceGet_ResponseDTO>("/curriculum/typeExperience", {
        typeExperienceId: body.typeExperienceId
    })).data;
}

export async function list() {
    return (await api.post<TypeExperienceList_ResponseDTO>("/curriculum/typeExperience/listar", {})).data;
}