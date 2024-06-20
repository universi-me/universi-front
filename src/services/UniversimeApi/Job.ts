import { Job } from "@/types/Job";
import { ApiResponse } from "@/types/UniversimeApi";
import { api } from "./api";

const BASE_PATH = "/job/";

export type JobGet_RequestDTO = {
    jobId: string;
};

export type JobCreate_RequestDTO = {
    title:                  string;
    shortDescription:       string;
    longDescription:        string;
    institutionId:          string;
    requiredCompetencesIds: string[];
};

export type JobUpdate_RequestDTO = {
    jobId:                   string;
    title?:                  string;
    shortDescription?:       string;
    longDescription?:        string;
    requiredCompetencesIds?: string[];
};

export type JobClose_RequestDTO = {
    jobId: string;
};

export type JobGet_ResponseDTO =    ApiResponse<{ job: Job }>;
export type JobList_ResponseDTO =   ApiResponse<{ list: Job[] }>;
export type JobCreate_ResponseDTO = ApiResponse<{ job: Job }>;
export type JobUpdate_ResponseDTO = ApiResponse<{ job: Job }>;
export type JobClose_ResponseDTO =  ApiResponse<{ job: Job }>;

export async function get(body: JobGet_RequestDTO) {
    const res = await api.post<JobGet_ResponseDTO>(BASE_PATH + "get", body);
    return res.data;
}

export async function listAll() {
    const res = await api.post<JobList_ResponseDTO>(BASE_PATH + "list", {});
    return res.data;
}

export async function listOpen() {
    const res = await api.post<JobList_ResponseDTO>(BASE_PATH + "list-open", {});
    return res.data;
}

export async function create(body: JobCreate_RequestDTO) {
    const res = await api.post<JobCreate_ResponseDTO>(BASE_PATH + "create", body);
    return res.data;
}

export async function update(body: JobUpdate_RequestDTO) {
    const res = await api.post<JobUpdate_ResponseDTO>(BASE_PATH + "update", body);
    return res.data;
}

export async function close(body: JobClose_RequestDTO) {
    const res = await api.post<JobClose_ResponseDTO>(BASE_PATH + "close", body);
    return res.data;
}
