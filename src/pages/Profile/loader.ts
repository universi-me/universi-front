import UniversimeApi from "@/services/UniversimeApi";
import type { Achievements } from "@/types/Achievements";
import type { Folder } from "@/types/Capacity";
import type { Competence, CompetenceType } from "@/types/Competence";
import type { Group } from "@/types/Group";
import type { Link } from "@/types/Link";
import type { Profile } from "@/types/Profile";
import type { Recommendation } from "@/types/Recommendation";
import type { LoaderFunctionArgs } from "react-router-dom";

export type ProfilePageLoaderResponse = {
    profile:             Profile | undefined;
    accessingLoggedUser: boolean;
    allCompetenceTypes:  CompetenceType[];

    profileListData: {
        groups:                  Group[];
        competences:             Competence[];
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

    const [fetchProfile, fetchCompetenceTypes] = await Promise.all([
        UniversimeApi.Profile.get({username}),
        UniversimeApi.CompetenceType.list(),
    ]);

    if (!fetchProfile.success || !fetchProfile.body?.profile || !fetchCompetenceTypes.success || !fetchCompetenceTypes.body?.list)
        return FAILED_TO_LOAD;

    const [fetchGroups, fetchCompetences, fetchLinks, fetchRecommendations, fetchFolders] = await Promise.all([
        UniversimeApi.Profile.groups({username}),
        UniversimeApi.Profile.competences({username}),
        UniversimeApi.Profile.links({username}),
        UniversimeApi.Profile.recommendations({username}),
        UniversimeApi.Profile.folders({username, assignedOnly: true}),
    ]);

    return {
        profile: fetchProfile.body.profile,
        accessingLoggedUser: fetchProfile.body.profile.user.ownerOfSession,
        allCompetenceTypes: fetchCompetenceTypes.body.list,

        profileListData: {
            achievements: [], // todo: fetch achievements,
            competences: fetchCompetences.body?.competences ?? [],
            folders: fetchFolders.body?.folders ?? [],
            groups: fetchGroups.body?.groups ?? [],
            links: fetchLinks.body?.links ?? [],
            recommendationsReceived: fetchRecommendations.body?.recomendationsReceived ?? [],
            recommendationsSend: fetchRecommendations.body?.recomendationsSend ?? [],
        },
    };
}

const FAILED_TO_LOAD: ProfilePageLoaderResponse = {
    profile: undefined,
    accessingLoggedUser: false,
    allCompetenceTypes: [],
    profileListData: {
        achievements: [],
        competences: [],
        folders: [],
        groups: [],
        links: [],
        recommendationsReceived: [],
        recommendationsSend: [],
    },
};
