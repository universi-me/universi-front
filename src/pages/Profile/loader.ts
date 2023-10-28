import UniversimeApi from "@/services/UniversimeApi";
import type { Achievements } from "@/types/Achievements";
import type { Folder } from "@/types/Capacity";
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
import { TypeVacancy } from "@/types/TypeVacancy";
import { Vacancy } from "@/types/Vacancy";
import type { LoaderFunctionArgs } from "react-router-dom";

export type ProfilePageLoaderResponse = {
    profile:             Profile | undefined;
    accessingLoggedUser: boolean;
    allInstitution:      Institution[];
    allCompetenceTypes:  CompetenceType[];
    allTypeEducation:    TypeEducation[];
    allTypeExperience:   TypeExperience[];
    allTypeVacancy:      TypeVacancy[];

    profileListData: {
        groups:                  Group[];
        education:               Education[];
        experience:              Experience[];
        competences:             Competence[];
        vacancies:               Vacancy[];
        links:                   Link[];
        recommendationsSend:     Recommendation[];
        recommendationsReceived: Recommendation[];
        achievements:            Achievements[];
        folders:                 Folder[];
    };
};

export async function ProfilePageLoader(args: LoaderFunctionArgs): Promise<ProfilePageLoaderResponse> {
    const username = args.params["id"];
    if (username === undefined)
        return FAILED_TO_LOAD;

    const [fetchProfile, fetchCompetenceTypes, fetchInstitution, fetchEducationTypes, fetchExperienceTypes, fetchVacancyTypes] = await Promise.all([
        UniversimeApi.Profile.get({username}),
        UniversimeApi.CompetenceType.list(),
        UniversimeApi.Institution.list(),
        UniversimeApi.TypeEducation.list(),
        UniversimeApi.TypeExperience.list(),
        UniversimeApi.TypeVacancy.list(),
    ]);

    if (!fetchProfile.success || !fetchProfile.body?.profile || !fetchCompetenceTypes.success || !fetchCompetenceTypes.body?.list)
        return FAILED_TO_LOAD;

    const [fetchGroups, fetchCompetences, fetchLinks, fetchRecommendations, fetchFolders, fetchEducation, fetchExperience, fetchVacancy] = await Promise.all([
        UniversimeApi.Profile.groups({username}),
        UniversimeApi.Profile.competences({username}),
        UniversimeApi.Profile.links({username}),
        UniversimeApi.Profile.recommendations({username}),
        UniversimeApi.Profile.folders({username, assignedOnly: true}),
        UniversimeApi.Profile.educations({username}),
        UniversimeApi.Profile.experiences({username}),
        UniversimeApi.Vacancy.list(),
    ]);

    return {
        profile: fetchProfile.body.profile,
        accessingLoggedUser: fetchProfile.body.profile.user.ownerOfSession,
        allCompetenceTypes: fetchCompetenceTypes.body.list,
        allInstitution: fetchInstitution,
        allTypeExperience: fetchExperienceTypes,
        allTypeEducation: fetchEducationTypes,
        allTypeVacancy: fetchVacancyTypes,
        


        profileListData: {
            achievements: [],
            competences: fetchCompetences.body?.competences ?? [],
            folders: fetchFolders.body?.folders ?? [],
            groups: fetchGroups.body?.groups ?? [],
            links: fetchLinks.body?.links ?? [],
            experience: fetchExperience.body?.experiences ?? [],
            education: fetchEducation.body?.educations ?? [],
            recommendationsReceived: fetchRecommendations.body?.recomendationsReceived ?? [],
            recommendationsSend: fetchRecommendations.body?.recomendationsSend ?? [],
            vacancies: []
        },
    };
}

const FAILED_TO_LOAD: ProfilePageLoaderResponse = {
    profile: undefined,
    accessingLoggedUser: false,
    allCompetenceTypes: [],
    allInstitution: [],
    allTypeExperience: [],
    allTypeEducation: [],
    allTypeVacancy: [],
    profileListData: {
        achievements: [],
        competences: [],
        folders: [],
        experience: [],
        education: [],
        vacancies: [],
        groups: [],
        links: [],
        recommendationsReceived: [],
        recommendationsSend: [],
    },
};
