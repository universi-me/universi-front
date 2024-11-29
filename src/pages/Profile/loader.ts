import UniversimeApi from "@/services/UniversimeApi";
import type { Folder, FolderProfile } from "@/types/Capacity";
import type { CompetenceProfileDTO, CompetenceType } from "@/types/Competence";
import { Education } from "@/types/Education";
import { Experience, TypeExperience } from "@/types/Experience";
import type { Group } from "@/types/Group";
import { Institution } from "@/types/Institution";
import type { Link } from "@/types/Link";
import type { Profile } from "@/types/Profile";
import { TypeEducation } from "@/types/TypeEducation";
import { removeFalsy } from "@/utils/arrayUtils";
import type { LoaderFunctionArgs } from "react-router-dom";

export type ProfilePageLoaderResponse = {
    profile:             Profile | undefined;
    accessingLoggedUser: boolean;
    allTypeCompetence:  CompetenceType[];
    allTypeEducation:    TypeEducation[];
    allTypeExperience:   TypeExperience[]; 
    allInstitution:  Institution[];

    profileListData: {
        groups:                  Group[];
        competences:             CompetenceProfileDTO[];
        education:               Education[];
        experience:              Experience[];
        links:                   Link[];
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
        UniversimeApi.Institution.listAll(),
    ]);

    if (!fetchProfile.success || !fetchProfile.body?.profile )
        return FAILED_TO_LOAD;

    const isOwnProfile = fetchProfile.body.profile.user.ownerOfSession;

    const [fetchGroups, fetchCompetences, fetchLinks, fetchFolders, fetchEducations, fetchExperiences, fetchAssignedByMe] = await Promise.all([
        UniversimeApi.Profile.groups({username}),
        UniversimeApi.Profile.competences({username}),
        UniversimeApi.Profile.links({username}),
        UniversimeApi.Profile.folders({username}),
        UniversimeApi.Profile.educations({username}),
        UniversimeApi.Profile.experiences({username}),
        isOwnProfile ? UniversimeApi.Capacity.foldersAssignedBy({username}) : Promise.resolve(undefined),
    ]);

    return {
        profile: fetchProfile.body.profile,
        accessingLoggedUser: fetchProfile.body.profile.user.ownerOfSession,
        allTypeCompetence: fetchCompetenceTypes.body?.list ?? [],
        allTypeEducation: fetchEducationTypes.body?.lista ?? [],
        allTypeExperience: fetchExperienceTypes.body?.lista ?? [],
        allInstitution: fetchInstitutions.body?.list ?? [],

        profileListData: {
            competences: fetchCompetences.body?.competences ?? [],
            education: fetchEducations.body?.educations ?? [],
            experience: fetchExperiences.body?.experiences ?? [],
            folders: fetchFolders.body?.folders ? removeFalsy(fetchFolders.body.folders) : [],
            favorites: fetchFolders.body?.favorites ? removeFalsy(fetchFolders.body.favorites) : [],
            groups: fetchGroups.body?.groups.sort((g1, g2) => {
                if (g1.rootGroup && !g2.rootGroup) {
                    return -1; 
                } else if (!g1.rootGroup && g2.rootGroup) {
                    return 1; 
                } else {
                    return g1.name.localeCompare(g2.name);
                }
            }) ?? [],
            links: fetchLinks.body?.links ?? [],
            assignedByMe: fetchAssignedByMe?.body?.folders ?? [],
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
        competences: [],
        education: [],
        experience: [],
        folders: [],
        favorites: [],
        groups: [],
        links: [],
        assignedByMe: [],
    },
};
