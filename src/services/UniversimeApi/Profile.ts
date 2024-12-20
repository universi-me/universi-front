import type { CompetenceProfileDTO } from "@/types/Competence";
import type { Group } from "@/types/Group";
import type { Link } from "@/types/Link";
import type { Profile } from "@/types/Profile";
import type { Recommendation } from "@/types/Recommendation";
import type { ApiResponse } from "@/types/UniversimeApi";
import type { Folder } from "@/types/Capacity";
import { createApiInstance } from "./api";
import { Education } from "@/types/Education";
import { Experience } from "@/types/Experience";

const api = createApiInstance( "/profile" )

export type ProfileEdit_RequestDTO = {
    profileId: string;
    name?:     string;
    lastname?: string;
    bio?:      string;
    gender?:   string;
    imageUrl?: string;
    rawPassword?: string;
};

export type ProfileIdAndUsername_RequestDTO = {
    profileId?: string;
    username?:  string;
};

export type ProfileFolders_RequestDTO = ProfileIdAndUsername_RequestDTO & {
};

export type ProfileGet_ResponseDTO =             ApiResponse<{ profile: Profile }>;
export type ProfileEdit_ResponseDTO =            ApiResponse;
export type ProfileGroups_ResponseDTO =          ApiResponse<{ groups: Group[] }>;
export type ProfileCompetences_ResponseDTO =     ApiResponse<{ competences: CompetenceProfileDTO[] }>;
export type ProfileEducation_ResponseDTO =     ApiResponse<{ educations: Education[] }>;
export type ProfileExperience_ResponseDTO =     ApiResponse<{ experiences: Experience[] }>;
export type ProfileLinks_ResponseDTO =           ApiResponse<{ links: Link[] }>;
export type ProfileRecommendations_ResponseDTO = ApiResponse<{
    recomendationsSend: Recommendation[];
    recomendationsReceived: Recommendation[]
}>;
export type ProfileFolders_ResponseDTO         = ApiResponse<{ folders: Folder[], favorites: Folder[] }>;

export async function profile() {
    return (await api.get<ProfileGet_ResponseDTO>('', {})).data
}

export async function get(body: ProfileIdAndUsername_RequestDTO) {
    return (await api.post<ProfileGet_ResponseDTO>('/get', {
        profileId: body.profileId,
        username:  body.username,
    })).data
}

export async function edit(body: ProfileEdit_RequestDTO) {
    return (await api.post<ProfileEdit_ResponseDTO>('/edit', body)).data
}

export async function groups(body: ProfileIdAndUsername_RequestDTO) {
    return (await api.post<ProfileGroups_ResponseDTO>('/groups', {
        profileId: body.profileId,
        username:  body.username,
    })).data
}

export async function competences(body: ProfileIdAndUsername_RequestDTO) {
    return (await api.post<ProfileCompetences_ResponseDTO>('/competences', {
        profileId: body.profileId,
        username:  body.username,
    })).data
}

export async function educations(body: ProfileIdAndUsername_RequestDTO) {
    return (await api.post<ProfileEducation_ResponseDTO>('/educations', {
        profileId: body.profileId,
        username:  body.username,
    })).data
}

export async function experiences(body: ProfileIdAndUsername_RequestDTO) {
    return (await api.post<ProfileExperience_ResponseDTO>('/experiences', {
        profileId: body.profileId,
        username:  body.username,
    })).data
}

export async function links(body: ProfileIdAndUsername_RequestDTO) {
    return (await api.post<ProfileLinks_ResponseDTO>('/links', {
        profileId: body.profileId,
        username:  body.username,
    })).data
}

export async function recommendations(body: ProfileIdAndUsername_RequestDTO) {
    return (await api.post<ProfileRecommendations_ResponseDTO>('/recomendations', {
        profileId: body.profileId,
        username:  body.username,
    })).data
}

export async function folders(body: ProfileFolders_RequestDTO) {
    return (await api.post<ProfileFolders_ResponseDTO>("/folders", {
        profileId: body.profileId,
        username:  body.username,
    })).data;
}
