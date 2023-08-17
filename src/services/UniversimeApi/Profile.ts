import axios from "axios";

const profileApi = axios.create({
    baseURL: `${import.meta.env.VITE_UNIVERSIME_API}/profile`,
    withCredentials: true,
});

export type ProfileEditBody = {
    profileId: number;
    name?:     string;
    lastname?: string;
    bio?:      string;
    gender?:   string;
};

export type ProfileIdAndUsername = {
    profileId?: number;
    username?:  string;
};

export async function profile() {
    return (await profileApi.get('', {})).data
}

export async function get(body: ProfileIdAndUsername) {
    return (await profileApi.post('/get', {
        profileId: body.profileId?.toString(),
        username:  body.username,
    })).data
}

export async function edit(body: ProfileEditBody) {
    return (await profileApi.post('/edit', body)).data
}

export async function groups(body: ProfileIdAndUsername) {
    return (await profileApi.post('/groups', {
        profileId: body.profileId?.toString(),
        username:  body.username,
    })).data
}

export async function competences(body: ProfileIdAndUsername) {
    return (await profileApi.post('/competences', {
        profileId: body.profileId?.toString(),
        username:  body.username,
    })).data
}

export async function links(body: ProfileIdAndUsername) {
    return (await profileApi.post('/links', {
        profileId: body.profileId?.toString(),
        username:  body.username,
    })).data
}

export async function recommendations(body: ProfileIdAndUsername) {
    return (await profileApi.post('/recomendations', {
        profileId: body.profileId?.toString(),
        username:  body.username,
    })).data
}
