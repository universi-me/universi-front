import axios from "axios";

const groupApi = axios.create({
    baseURL: `${import.meta.env.VITE_UNIVERSIME_API}/group`,
    withCredentials: true,
});

export async function get(groupId?: number, groupPath?: string) {
    return (await groupApi.post('/get', {
        groupId: groupId?.toString(),
        groupPath,
    })).data;
}

export async function subgroups(groupId: number) {
    return (await groupApi.post('/list', {
        groupId: groupId.toString(),
    })).data;
}

export async function participants(groupId: number) {
    return (await groupApi.post('/participant/list', {
        groupId: groupId.toString(),
    })).data;
}

export async function join(groupId: number) {
    return (await groupApi.post('/participant/enter', {
        groupId: groupId.toString(),
    })).data;
}

export async function exit(groupId: number) {
    return (await groupApi.post('/participant/exit', {
        groupId: groupId.toString(),
    })).data;
}
