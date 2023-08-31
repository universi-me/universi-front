import type { Group, GroupType } from "@/types/Group";
import type { Profile } from "@/types/Profile";
import type { ApiResponse } from "@/types/UniversimeApi";
import axios from "axios";

const groupApi = axios.create({
    baseURL: `${import.meta.env.VITE_UNIVERSIME_API}/group`,
    withCredentials: true,
});

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

export type GroupIdOrPath_RequestDTO = {
    groupId?:   string;
    groupPath?: string;
};

export type GroupGet_ResponseDTO =          ApiResponse<{ group: Group }>;
export type GroupCreate_ResponseDTO =       ApiResponse;
export type GroupSubgroups_ResponseDTO =    ApiResponse<{ subgroups: Group[] }>;
export type GroupParticipants_ResponseDTO = ApiResponse<{ participants: Profile[] }>;
export type GroupJoin_ResponseDTO =         ApiResponse;
export type GroupExit_ResponseDTO =         ApiResponse;

export async function get(body: GroupIdOrPath_RequestDTO) {
    return (await groupApi.post<GroupGet_ResponseDTO>('/get', {
        groupId:   body.groupId,
        groupPath: body.groupPath,
    })).data;
}

export async function create(body: GroupCreate_RequestDTO) {
    return (await groupApi.post<GroupCreate_ResponseDTO>("/create", {
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

export async function subgroups(body: GroupId_RequestDTO) {
    return (await groupApi.post<GroupSubgroups_ResponseDTO>('/list', {
        groupId: body.groupId,
    })).data;
}

export async function participants(body: GroupId_RequestDTO) {
    return (await groupApi.post<GroupParticipants_ResponseDTO>('/participant/list', {
        groupId: body.groupId,
    })).data;
}

export async function join(body: GroupId_RequestDTO) {
    return (await groupApi.post<GroupJoin_ResponseDTO>('/participant/enter', {
        groupId: body.groupId,
    })).data;
}

export async function exit(body: GroupId_RequestDTO) {
    return (await groupApi.post<GroupExit_ResponseDTO>('/participant/exit', {
        groupId: body.groupId,
    })).data;
}
