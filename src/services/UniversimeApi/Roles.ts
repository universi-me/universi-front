import { Roles, RolesProfile } from "@/types/Roles";
import { ApiResponse } from "@/types/UniversimeApi";
import { api } from "./api";

export type RolesCreate_RequestDTO = {
    groupId:        string;
    name:           string;
    description:    string;
}

export type RolesGet_RequestDTO = {
    id:             string;
}

export type RolesRemove_RequestDTO = {
    rolesId:        string;
}

export type RolesEdit_RequestDTO = {
    rolesId:        string;
    name:           string;
    description:    string;
}

export type RolesAssign_RequestDTO = {
    rolesId:        string;
    profileId:      string;
}

export type RolesAssigned_RequestDTO = {
    groupId:        string;
    profileId:      string;
}

export type RolesList_RequestDTO = {
    groupId:        string;
}

export type RolesCreate_ResponseDTO = ApiResponse <{ roles:  Roles }>;
export type RolesGet_ResponseDTO =    ApiResponse <{ roles:  Roles }>;
export type RolesEdit_ResponseDTO =   ApiResponse <{ roles:  Roles }>;
export type RolesList_ResponseDTO =   ApiResponse <{ roles: Roles[] }>;
export type RolesParticipantsList_ResponseDTO =   ApiResponse <{ participants: RolesProfile[] }>;
export type RolesRemove_ResponseDTO = ApiResponse;
export type RolesAssign_ResponseDTO = ApiResponse;

export async function get(body:RolesGet_RequestDTO) {
    return (await api.post<RolesGet_ResponseDTO>("/roles/get", {
        id:                 body.id,
    })).data;
}

export async function create(body:RolesCreate_RequestDTO) {
    return (await api.post<RolesCreate_ResponseDTO>("/roles/create", {
        groupId:            body.groupId,
        name:               body.name,
        description:        body.description,
    })).data;
}

export async function edit(body: RolesEdit_RequestDTO) {
    return (await api.post<RolesEdit_ResponseDTO>("/roles/edit", {
        rolesId:            body.rolesId,
        name:               body.name,
        description:        body.description,
    })).data;
}

export async function remove(body:  RolesRemove_RequestDTO) {
    return (await api.post<RolesRemove_ResponseDTO>("/roles/remove", {
        rolesId:            body.rolesId,
    })).data;
}

export async function list(body: RolesList_RequestDTO) {
    return (await api.post<RolesList_ResponseDTO>("/roles/list", {
        groupId:             body.groupId
    })).data
}

export async function listPaticipants(body: RolesList_RequestDTO) {
    return (await api.post<RolesParticipantsList_ResponseDTO>("/roles/participants/list", {
        groupId:             body.groupId
    })).data
}



export async function assign(body:  RolesAssign_RequestDTO) {
    return (await api.post<RolesRemove_ResponseDTO>("/roles/assign", {
        rolesId:                 body.rolesId,
        profileId:               body.profileId
    })).data;
}

export async function assigned(body:  RolesAssigned_RequestDTO) {
    return (await api.post<RolesRemove_ResponseDTO>("/roles/assigned", {
        groupId:                 body.groupId,
        profileId:               body.profileId
    })).data;
}

export async function listRoles() {
    return (await api.get<RolesList_ResponseDTO>("/roles")).data
}