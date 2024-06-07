import { ExperienceLocal } from "@/types/Experience";
import { ApiResponse } from "@/types/UniversimeApi";
import { api } from "./api";

const BASE_PATH = "/curriculum/experience/local/";

export type ExperienceLocalCreate_RequestDTO = {
    name: string;
}

export type ExperienceLocalEdit_RequestDTO = {
    id: string;
    name?: string;
};

export type ExperienceLocalDelete_RequestDTO = {
    id: string;
};

export type ExperienceLocalListAll_ResponseDTO = ApiResponse<{ list: ExperienceLocal[] }>;
export type ExperienceLocalCreate_ResponseDTO =  ApiResponse<{ experienceLocal: ExperienceLocal }>;
export type ExperienceLocalEdit_ResponseDTO =  ApiResponse<{ experienceLocal: ExperienceLocal }>;
export type ExperienceLocalDelete_ResponseDTO =  ApiResponse;


export async function listAll() {
    const res = await api.post<ExperienceLocalListAll_ResponseDTO>(BASE_PATH + "list", {});
    return res.data;
}

export async function create(body: ExperienceLocalCreate_RequestDTO) {
    const res = await api.post<ExperienceLocalCreate_ResponseDTO>(BASE_PATH + "create", body);
    return res.data;
}

export async function edit(body: ExperienceLocalEdit_RequestDTO) {
    const res = await api.post<ExperienceLocalEdit_ResponseDTO>(BASE_PATH + "edit", body);
    return res.data;
}

export async function remove(body: ExperienceLocalDelete_RequestDTO) {
    const res = await api.post<ExperienceLocalDelete_ResponseDTO>(BASE_PATH + "delete", body);
    return res.data;
}
