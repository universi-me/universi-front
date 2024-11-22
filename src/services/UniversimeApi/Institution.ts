import { Institution } from "@/types/Institution";
import { ApiResponse } from "@/types/UniversimeApi";
import { createApiInstance } from "./api";

const api = createApiInstance( "/institution" )

export type InstitutionCreate_RequestDTO = {
    name: string;
}

export type InstitutionEdit_RequestDTO = {
    id: string;
    name?: string;
};

export type InstitutionDelete_RequestDTO = {
    id: string;
};

export type InstitutionListAll_ResponseDTO = ApiResponse<{ list: Institution[] }>;
export type InstitutionCreate_ResponseDTO =  ApiResponse<{ institution: Institution }>;
export type InstitutionEdit_ResponseDTO =  ApiResponse<{ institution: Institution }>;
export type InstitutionDelete_ResponseDTO =  ApiResponse;


export async function listAll() {
    const res = await api.post<InstitutionListAll_ResponseDTO>("/list", {});
    return res.data;
}

export async function create(body: InstitutionCreate_RequestDTO) {
    const res = await api.post<InstitutionCreate_ResponseDTO>("/create", body);
    return res.data;
}

export async function edit(body: InstitutionEdit_RequestDTO) {
    const res = await api.post<InstitutionEdit_ResponseDTO>("/edit", body);
    return res.data;
}

export async function remove(body: InstitutionDelete_RequestDTO) {
    const res = await api.post<InstitutionDelete_ResponseDTO>("/delete", body);
    return res.data;
}
