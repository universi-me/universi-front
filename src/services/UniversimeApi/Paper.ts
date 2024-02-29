import { Paper, PaperProfile } from "@/types/Paper";
import { ApiResponse } from "@/types/UniversimeApi";
import { api } from "./api";

export type PaperCreate_RequestDTO = {
    groupId:        string;
    name:           string;
    description:    string;
}

export type PaperGet_RequestDTO = {
    id:             string;
}

export type PaperRemove_RequestDTO = {
    paperId:        string;
}

export type PaperEdit_RequestDTO = {
    paperId:        string;
    name:           string;
    description:    string;
}

export type PaperAssign_RequestDTO = {
    paperId:        string;
    profileId:      string;
}

export type PaperAssigned_RequestDTO = {
    groupId:        string;
    profileId:      string;
}

export type PaperList_RequestDTO = {
    groupId:        string;
}

export type PaperCreate_ResponseDTO = ApiResponse <{ paper:  Paper }>;
export type PaperGet_ResponseDTO =    ApiResponse <{ paper:  Paper }>;
export type PaperEdit_ResponseDTO =   ApiResponse <{ paper:  Paper }>;
export type PaperList_ResponseDTO =   ApiResponse <{ papers: Paper[] }>;
export type PaperParticipantsList_ResponseDTO =   ApiResponse <{ participants: PaperProfile[] }>;
export type PaperRemove_ResponseDTO = ApiResponse;
export type PaperAssign_ResponseDTO = ApiResponse;

export async function get(body:PaperGet_RequestDTO) {
    return (await api.post<PaperGet_ResponseDTO>("/paper/get", {
        id:                 body.id,
    })).data;
}

export async function create(body:PaperCreate_RequestDTO) {
    return (await api.post<PaperCreate_ResponseDTO>("/paper/create", {
        groupId:            body.groupId,
        name:               body.name,
        description:        body.description,
    })).data;
}

export async function edit(body: PaperEdit_RequestDTO) {
    return (await api.post<PaperEdit_ResponseDTO>("/paper/edit", {
        paperId:            body.paperId,
        name:               body.name,
        description:        body.description,
    })).data;
}

export async function remove(body:  PaperRemove_RequestDTO) {
    return (await api.post<PaperRemove_ResponseDTO>("/paper/remove", {
        paperId:            body.paperId,
    })).data;
}

export async function list(body: PaperList_RequestDTO) {
    return (await api.post<PaperList_ResponseDTO>("/paper/list", {
        groupId:             body.groupId
    })).data
}

export async function listPaticipants(body: PaperList_RequestDTO) {
    return (await api.post<PaperParticipantsList_ResponseDTO>("/paper/participants/list", {
        groupId:             body.groupId
    })).data
}



export async function assign(body:  PaperAssign_RequestDTO) {
    return (await api.post<PaperRemove_ResponseDTO>("/paper/assign", {
        paperId:                 body.paperId,
        profileId:               body.profileId
    })).data;
}

export async function assigned(body:  PaperAssigned_RequestDTO) {
    return (await api.post<PaperRemove_ResponseDTO>("/paper/assigned", {
        groupId:                 body.groupId,
        profileId:               body.profileId
    })).data;
}