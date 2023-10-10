import { ApiResponse } from "@/types/UniversimeApi";
import { api } from "./api";
import { TypeEducation } from "@/types/typeEducation";


export type typeEducation_RequestDTO = {
    typeEducationId: string;
}

export type typeEducationGet_ResponseDTO = ApiResponse<{ typeEducation: TypeEducation }>;
export type typeEducationList_ResponseDTO = ApiResponse<{ list: TypeEducation[] }>;

export async function get(body: typeEducation_RequestDTO) {
    return (await api.post<typeEducationGet_ResponseDTO>("/curriculum/TypeEducation", {
        instituionId: body.typeEducationId
    })).data;
}

export async function list() {
    return (await api.post("/curriculum/TypeEducation", {})).data;
}