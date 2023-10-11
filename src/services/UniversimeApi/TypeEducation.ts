import { ApiResponse } from "@/types/UniversimeApi";
import { api } from "./api";
import { TypeEducation } from "@/types/TypeEducation";


export type typeEducation_RequestDTO = {
    typeEducationId: string;
}

export type TypeEducationGet_ResponseDTO = ApiResponse<{ typeEducation: TypeEducation }>;
export type TypeEducationList_ResponseDTO = TypeEducation[];

export async function get(body: typeEducation_RequestDTO) {
    return (await api.post<TypeEducationGet_ResponseDTO>("/curriculum/TypeEducation", {
        instituionId: body.typeEducationId
    })).data;
}

export async function list() {
    return (await api.get<TypeEducationList_ResponseDTO>("/curriculum/TypeEducation", {})).data;
}