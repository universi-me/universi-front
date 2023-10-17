import type { Competence } from "@/types/Competence";
import type { Group } from "@/types/Group";
import type { Link } from "@/types/Link";
import type { Profile } from "@/types/Profile";
import type { Recommendation } from "@/types/Recommendation";
import type { ApiResponse } from "@/types/UniversimeApi";
import { api } from "./api";
import { Education } from "@/types/Education";
import { Experience } from "@/types/Experience";

export type ProfileEdit_RequestDTO = {
    profileId: string;
    name?:     string;
    lastname?: string;
    bio?:      string;
    gender?:   string;
    imageUrl?: string;
};

export type ProfileIdAndUsername_RequestDTO = {
    profileId?: string;
    username?:  string;
};

export type ProfileGet_ResponseDTO =             ApiResponse<{ profile: Profile }>;
export type ProfileEdit_ResponseDTO =            ApiResponse;
export type ProfileGroups_ResponseDTO =          ApiResponse<{ groups: Group[] }>;
export type ProfileCompetences_ResponseDTO =     ApiResponse<{ competences: Competence[] }>;
export type ProfileEducation_ResponseDTO =     ApiResponse<{ educations: Education[] }>;
export type ProfileExperience_ResponseDTO =     ApiResponse<{ experiences: Experience[] }>;
export type ProfileLinks_ResponseDTO =           ApiResponse<{ links: Link[] }>;
export type ProfileRecommendations_ResponseDTO = ApiResponse<{
    recomendationsSend: Recommendation[];
    recomendationsReceived: Recommendation[]
}>;

export async function profile() {
    return (await api.get<ProfileGet_ResponseDTO>('/profile', {})).data
}

export async function get(body: ProfileIdAndUsername_RequestDTO) {
    return (await api.post<ProfileGet_ResponseDTO>('/profile/get', {
        profileId: body.profileId,
        username:  body.username,
    })).data
}

export async function edit(body: ProfileEdit_RequestDTO) {
    return (await api.post<ProfileEdit_ResponseDTO>('/profile/edit', body)).data
}

export async function groups(body: ProfileIdAndUsername_RequestDTO) {
    return (await api.post<ProfileGroups_ResponseDTO>('/profile/groups', {
        profileId: body.profileId,
        username:  body.username,
    })).data
}

export async function competences(body: ProfileIdAndUsername_RequestDTO) {
    return (await api.post<ProfileCompetences_ResponseDTO>('/profile/competences', {
        profileId: body.profileId,
        username:  body.username,
    })).data
}

export async function educations(body: ProfileIdAndUsername_RequestDTO) {
    return (await api.post<ProfileEducation_ResponseDTO>('/profile/educations', {
        profileId: body.profileId,
        username:  body.username,
    })).data
}

export async function experiences(body: ProfileIdAndUsername_RequestDTO) {
    return (await api.post<ProfileExperience_ResponseDTO>('/profile/experiences', {
        profileId: body.profileId,
        username:  body.username,
    })).data
}

export async function links(body: ProfileIdAndUsername_RequestDTO) {
    return (await api.post<ProfileLinks_ResponseDTO>('/profile/links', {
        profileId: body.profileId,
        username:  body.username,
    })).data
}

export async function recommendations(body: ProfileIdAndUsername_RequestDTO) {
    return (await api.post<ProfileRecommendations_ResponseDTO>('/profile/recomendations', {
        profileId: body.profileId,
        username:  body.username,
    })).data
}
