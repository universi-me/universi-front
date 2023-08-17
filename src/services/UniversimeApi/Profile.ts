import axios from "axios";

const profileApi = axios.create({
    baseURL: `${import.meta.env.VITE_UNIVERSIME_API}/profile`,
    withCredentials: true,
});

export type ProfileEditBody = {
    profileId: string;
    name?: string;
    lastname?: string;
    bio?: string;
    sexo?: string;
};

export async function profile() {
    return (await profileApi.get('', {})).data
}

export async function get(profileId?: number, username?: string) {
    return (await profileApi.post('/get', { profileId, username })).data
}

export async function edit(body: ProfileEditBody) {
    return (await profileApi.post('/edit', body)).data
}

export async function groups(profileId?: number, username?: string) {
    return (await profileApi.post('/groups', {
        profileId: profileId?.toString(),
        username,
    })).data
}

export async function competences(profileId?: number, username?: string) {
    return (await profileApi.post('/competences', {
        profileId: profileId?.toString(),
        username,
    })).data
}

export async function links(profileId?: number, username?: string) {
    return (await profileApi.post('/links', {
        profileId: profileId?.toString(),
        username,
    })).data
}

export async function recommendations(profileId?: number, username?: string) {
    return (await profileApi.post('/recomendations', {
        profileId: profileId?.toString(),
        username,
    })).data
}