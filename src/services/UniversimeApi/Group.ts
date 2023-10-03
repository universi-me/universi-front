import type { Group, GroupType } from "@/types/Group";
import type { Profile } from "@/types/Profile";
import type { ApiResponse } from "@/types/UniversimeApi";
import { api } from "./api";
import { Folder } from "@/types/Capacity";

export type GroupId_RequestDTO = {
    groupId: string;
};

export type GroupCreate_RequestDTO = {
    name:            string;
    description:     string;
    nickname:        string;
    groupType:       GroupType;
    imageUrl?:       string;
    canHaveSubgroup: boolean;
    isPublic:        boolean;
    canJoin:         boolean;
    isRootGroup:     boolean;
    parentGroupId?:  string;
};

export type GroupUpdate_RequestDTO = {
    groupId?:   string;
    groupPath?: string;

    name?:            string;
    description?:     string;
    groupType?:       GroupType;
    imageUrl?:        string;
    canHaveSubgroup?: boolean;
    isPublic?:        boolean;
    canJoin?:         boolean;
};

export type GroupIdOrPath_RequestDTO = {
    groupId?:   string;
    groupPath?: string;
};

export type GroupGet_ResponseDTO =              ApiResponse<{ group: Group }>;
export type GroupCreate_ResponseDTO =           ApiResponse;
export type GroupUpdate_ResponseDTO =           ApiResponse;
export type GroupAvailableParents_ResponseDTO = ApiResponse<{ groups: Group[] }>;
export type GroupSubgroups_ResponseDTO =        ApiResponse<{ subgroups: Group[] }>;
export type GroupParticipants_ResponseDTO =     ApiResponse<{ participants: Profile[] }>;
export type GroupJoin_ResponseDTO =             ApiResponse;
export type GroupExit_ResponseDTO =             ApiResponse;
export type GroupFolders_ResponseDTO =          ApiResponse<{ folders: Folder[] }>;

export async function get(body: GroupIdOrPath_RequestDTO) {
    return (await api.post<GroupGet_ResponseDTO>('/group/get', {
        groupId:   body.groupId,
        groupPath: body.groupPath,
    })).data;
}

export async function create(body: GroupCreate_RequestDTO) {
    return (await api.post<GroupCreate_ResponseDTO>("/group/create", {
        groupRoot:      body.isRootGroup,
        groupId:        body.parentGroupId,
        nickname:       body.nickname,
        name:           body.name,
        description:    body.description,
        imageUrl:       body.imageUrl,
        type:           body.groupType,
        canCreateGroup: body.canHaveSubgroup,
        publicGroup:    body.isPublic,
        canEnter:       body.canJoin,
    })).data;
}

export async function update(body: GroupUpdate_RequestDTO) {
    return (await api.post<GroupUpdate_ResponseDTO>("/group/update", {
        groupId:        body.groupId,
        groupPath:      body.groupPath,
        name:           body.name,
        description:    body.description,
        type:           body.groupType,
        imageUrl:       body.imageUrl,
        canCreateGroup: body.canHaveSubgroup,
        publicGroup:    body.isPublic,
        canEnter:       body.canJoin,
    })).data;
}

export async function availableParents() {
    return (await api.post<GroupAvailableParents_ResponseDTO>("/group/parents", {})).data;
}

export async function subgroups(body: GroupId_RequestDTO) {
    return (await api.post<GroupSubgroups_ResponseDTO>('/group/list', {
        groupId: body.groupId,
    })).data;
}

export async function participants(body: GroupId_RequestDTO) {
    return (await api.post<GroupParticipants_ResponseDTO>('/group/participant/list', {
        groupId: body.groupId,
    })).data;
}

export async function join(body: GroupId_RequestDTO) {
    return (await api.post<GroupJoin_ResponseDTO>('/group/participant/enter', {
        groupId: body.groupId,
    })).data;
}

export async function exit(body: GroupId_RequestDTO) {
    return (await api.post<GroupExit_ResponseDTO>('/group/participant/exit', {
        groupId: body.groupId,
    })).data;
}

export async function folders(body: GroupIdOrPath_RequestDTO) {
    return (await api.post<GroupFolders_ResponseDTO>("/group/folders", {
        groupId: body.groupId,
        groupPath: body.groupPath,
    })).data;
}
