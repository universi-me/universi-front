import type { Competence } from "@/types/Competence";
import type { Group } from "@/types/Group";
import type { Link } from "@/types/Link";
import type { Profile } from "@/types/Profile";
import type { Recommendation } from "@/types/Recommendation";
import type { ApiResponse } from "@/types/UniversimeApi";
import axios from "axios";

const profileApi = axios.create({
    baseURL: `${import.meta.env.VITE_UNIVERSIME_API}/profile`,
    withCredentials: true,
});

export type ProfileEdit_RequestDTO = {
    profileId: string;
    name?:     string;
    lastname?: string;
    bio?:      string;
    gender?:   string;
};

export type ProfileIdAndUsername_RequestDTO = {
    profileId?: string;
    username?:  string;
};

export type ProfileGet_ResponseDTO =             ApiResponse<{ profile: Profile }>;
export type ProfileEdit_ResponseDTO =            ApiResponse;
export type ProfileGroups_ResponseDTO =          ApiResponse<{ groups: Group[] }>;
export type ProfileCompetences_ResponseDTO =     ApiResponse<{ competences: Competence[] }>;
export type ProfileLinks_ResponseDTO =           ApiResponse<{ links: Link[] }>;
export type ProfileRecommendations_ResponseDTO = ApiResponse<{
    recomendationsSend: Recommendation[];
    recomendationsReceived: Recommendation[]
}>;

export async function profile() {
    return (await profileApi.get<ProfileGet_ResponseDTO>('', {})).data
}

export async function get(body: ProfileIdAndUsername_RequestDTO) {
    return (await profileApi.post<ProfileGet_ResponseDTO>('/get', {
        profileId: body.profileId,
        username:  body.username,
    })).data
}

export async function edit(body: ProfileEdit_RequestDTO) {
    return (await profileApi.post<ProfileEdit_ResponseDTO>('/edit', body)).data
}

export async function groups(body: ProfileIdAndUsername_RequestDTO) {
    return (await profileApi.post<ProfileGroups_ResponseDTO>('/groups', {
        profileId: body.profileId,
        username:  body.username,
    })).data
}

export async function competences(body: ProfileIdAndUsername_RequestDTO) {
    return (await profileApi.post<ProfileCompetences_ResponseDTO>('/competences', {
        profileId: body.profileId,
        username:  body.username,
    })).data
}

export async function links(body: ProfileIdAndUsername_RequestDTO) {
    return (await profileApi.post<ProfileLinks_ResponseDTO>('/links', {
        profileId: body.profileId,
        username:  body.username,
    })).data
}

export async function recommendations(body: ProfileIdAndUsername_RequestDTO) {
    return (await profileApi.post<ProfileRecommendations_ResponseDTO>('/recomendations', {
        profileId: body.profileId,
        username:  body.username,
    })).data
}
