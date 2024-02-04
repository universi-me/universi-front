import UniversimeApi from "@/services/UniversimeApi";
import type { Achievements } from "@/types/Achievements";
import type { Folder, FolderProfile } from "@/types/Capacity";
import type { Competence, CompetenceType } from "@/types/Competence";
import { Education } from "@/types/Education";
import { Experience } from "@/types/Experience";
import type { Group } from "@/types/Group";
import { Institution } from "@/types/Institution";
import type { Link } from "@/types/Link";
import type { Profile } from "@/types/Profile";
import type { Recommendation } from "@/types/Recommendation";
import { TypeEducation } from "@/types/TypeEducation";
import { TypeExperience } from "@/types/TypeExperience";
import type { LoaderFunctionArgs } from "react-router-dom";

export type ProfilePageLoaderResponse = {
    profile:             Profile | undefined;
    accessingLoggedUser: boolean;
    allTypeCompetence:  CompetenceType[];
    allTypeEducation:    TypeEducation[];
    allTypeExperience:   TypeExperience[]; 
    allInstitution:      Institution[];

    profileListData: {
        groups:                  Group[];
        competences:             Competence[];
        education:               Education[];
        experience:              Experience[];
        links:                   Link[];
        recommendationsSend:     Recommendation[];
        recommendationsReceived: Recommendation[];
        achievements:            Achievements[];
        folders:                 Folder[];
        favorites:               Folder[];
        assignedByMe:            FolderProfile[];
    };
};

export async function fetchProfilePageData(username: string | undefined): Promise<ProfilePageLoaderResponse> {
    if (username === undefined)
        return FAILED_TO_LOAD;

    const [fetchProfile, fetchCompetenceTypes, fetchEducationTypes, fetchExperienceTypes, fetchInstitutions] = await Promise.all([
        UniversimeApi.Profile.get({username}),
        UniversimeApi.CompetenceType.list(),
        UniversimeApi.TypeEducation.list(),
        UniversimeApi.TypeExperience.list(),
        UniversimeApi.Institution.list(),
    ]);

    if (!fetchProfile.success || !fetchProfile.body?.profile )
        return FAILED_TO_LOAD;

    const [fetchGroups, fetchCompetences, fetchLinks, fetchRecommendations, fetchFolders, fetchEducations, fetchExperiences, fetchAssignedByMe] = await Promise.all([
        UniversimeApi.Profile.groups({username}),
        UniversimeApi.Profile.competences({username}),
        UniversimeApi.Profile.links({username}),
        UniversimeApi.Profile.recommendations({username}),
        UniversimeApi.Profile.folders({username, assignedOnly: true}),
        UniversimeApi.Profile.educations({username}),
        UniversimeApi.Profile.experiences({username}),
        UniversimeApi.Capacity.foldersAssignedBy({username}),
    ]);

    return {
        profile: fetchProfile.body.profile,
        accessingLoggedUser: fetchProfile.body.profile.user.ownerOfSession,
        allTypeCompetence: fetchCompetenceTypes.body?.list ?? [],
        allTypeEducation: fetchEducationTypes.body?.lista ?? [],
        allTypeExperience: fetchExperienceTypes.body?.lista ?? [],
        allInstitution: fetchInstitutions.body?.lista ?? [],
        

        profileListData: {
            achievements: [], // todo: fetch achievements,
            competences: fetchCompetences.body?.competences ?? [],
            education: fetchEducations.body?.educations ?? [],
            experience: fetchExperiences.body?.experiences ?? [],
            folders: fetchFolders.body?.folders ?? [],
            favorites: fetchFolders.body?.favorites ?? [],
            groups: fetchGroups.body?.groups ?? [],
            links: fetchLinks.body?.links ?? [],
            recommendationsReceived: fetchRecommendations.body?.recomendationsReceived ?? [],
            recommendationsSend: fetchRecommendations.body?.recomendationsSend ?? [],
            assignedByMe: fetchAssignedByMe.success ? fetchAssignedByMe.body.folders : [],
        },
    };
}

export async function ProfilePageLoader(args: LoaderFunctionArgs): Promise<ProfilePageLoaderResponse> {
    const username = args.params["id"];
    return fetchProfilePageData(username);
}

const FAILED_TO_LOAD: ProfilePageLoaderResponse = {
    profile: undefined,
    accessingLoggedUser: false,
    allTypeCompetence: [],
    allTypeEducation: [],
    allTypeExperience: [],
    allInstitution: [],
    profileListData: {
        achievements: [],
        competences: [],
        education: [],
        experience: [],
        folders: [],
        favorites: [],
        groups: [],
        links: [],
        recommendationsReceived: [],
        recommendationsSend: [],
        assignedByMe: [],
    },
};
