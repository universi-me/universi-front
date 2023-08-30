import type { CompetenceType } from "@/types/Competence";
import type { ApiResponse } from "@/types/UniversimeApi";
import axios from "axios";

const competenceTypeApi = axios.create({
    baseURL: `${import.meta.env.VITE_UNIVERSIME_API}/competencetype`,
    withCredentials: true,
});

export type CompetenceTypeGet_RequestDTO = {
    competenceTypeId: string;
};

export type CompetenceTypeGet_ResponseDTO =  ApiResponse<{ competenceType: CompetenceType }>;
export type CompetenceTypeList_ResponseDTO = ApiResponse<{ list: CompetenceType[] }>;

export async function get(body: CompetenceTypeGet_RequestDTO) {
    return (await competenceTypeApi.post<CompetenceTypeGet_ResponseDTO>("/get", {
        competenceTypeId: body.competenceTypeId,
    })).data;
}

export async function list() {
    return (await competenceTypeApi.post("/list", {})).data;
}
