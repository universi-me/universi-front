import { GroupType } from "@/types/Group";
import axios from "axios";

export type GroupIdDTO = {
    groupId: number;
};

export type GroupIdOrPathDTO = {
    groupId?:   number;
    groupPath?: string;
};

export type GroupCreateDTO = {
    name:            string;
    description:     string;
    nickname:        string;
    groupType:       GroupType;
    imageUrl?:       string;
    canHaveSubgroup: boolean;
    isPublic:        boolean;
    canJoin:         boolean;
    isRootGroup:     boolean;
    parentGroupId?:  number;
};

const groupApi = axios.create({
    baseURL: `${import.meta.env.VITE_UNIVERSIME_API}/group`,
    withCredentials: true,
});

export async function create(body: GroupCreateDTO) {
    return (await groupApi.post("/create", {
        groupRoot:      body.isRootGroup,
        groupId:        body.parentGroupId?.toString(),
        nickname:       body.nickname,
        name:           body.name,
        description:    body.description,
        imageUrl:       body.imageUrl,
        type:           body.groupType,
        canCreateGroup: body.canHaveSubgroup,
        publicGroup:    body.isPublic,
        canEnter:       body.canJoin,
    })).data
}

export async function get(body: GroupIdOrPathDTO) {
    return (await groupApi.post('/get', {
        groupId:   body.groupId?.toString(),
        groupPath: body.groupPath,
    })).data;
}

export async function subgroups(body: GroupIdDTO) {
    return (await groupApi.post('/list', {
        groupId: body.groupId.toString(),
    })).data;
}

export async function participants(body: GroupIdDTO) {
    return (await groupApi.post('/participant/list', {
        groupId: body.groupId.toString(),
    })).data;
}

export async function join(body: GroupIdDTO) {
    return (await groupApi.post('/participant/enter', {
        groupId: body.groupId.toString(),
    })).data;
}

export async function exit(body: GroupIdDTO) {
    return (await groupApi.post('/participant/exit', {
        groupId: body.groupId.toString(),
    })).data;
}
