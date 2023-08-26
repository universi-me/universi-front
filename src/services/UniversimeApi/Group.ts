import axios from "axios";

export type GroupIdDTO = {
    groupId: string;
};

export type GroupIdOrPathDTO = {
    groupId?:   string;
    groupPath?: string;
};

const groupApi = axios.create({
    baseURL: `${import.meta.env.VITE_UNIVERSIME_API}/group`,
    withCredentials: true,
});

export async function get(body: GroupIdOrPathDTO) {
    return (await groupApi.post('/get', {
        groupId:   body.groupId,
        groupPath: body.groupPath,
    })).data;
}

export async function subgroups(body: GroupIdDTO) {
    return (await groupApi.post('/list', {
        groupId: body.groupId,
    })).data;
}

export async function participants(body: GroupIdDTO) {
    return (await groupApi.post('/participant/list', {
        groupId: body.groupId,
    })).data;
}

export async function join(body: GroupIdDTO) {
    return (await groupApi.post('/participant/enter', {
        groupId: body.groupId,
    })).data;
}

export async function exit(body: GroupIdDTO) {
    return (await groupApi.post('/participant/exit', {
        groupId: body.groupId,
    })).data;
}
