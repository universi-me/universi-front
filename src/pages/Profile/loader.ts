import { UniversimeApi } from "@/services"
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
        competences:             Competence.DTO[];
        education:               Education[];
        experience:              Experience[];
        links:                   Link[];
        folders:                 Nullable<Folder[]>;
        favorites:               Folder[];
        assignedByMe:            FolderProfile[];
    };
};

export async function fetchProfilePageData(username: string | undefined): Promise<ProfilePageLoaderResponse> {
    if (username === undefined)
        return FAILED_TO_LOAD;

    const [fetchProfile, fetchCompetenceTypes, fetchEducationTypes, fetchExperienceTypes, fetchInstitutions] = await Promise.all([
        UniversimeApi.Profile.get( username ),
        UniversimeApi.CompetenceType.list(),
        UniversimeApi.EducationType.list(),
        UniversimeApi.ExperienceType.list(),
        UniversimeApi.Institution.list(),
    ]);

    if ( !fetchProfile.isSuccess() )
        return FAILED_TO_LOAD;

    const isOwnProfile = fetchProfile.data.user.ownerOfSession;

    const [fetchGroups, fetchCompetences, fetchLinks, fetchFavorites, fetchAssignements, fetchEducations, fetchExperiences, fetchAssignedByMe] = await Promise.all([
        UniversimeApi.Profile.groups( username ),
        UniversimeApi.Profile.competences( username ),
        UniversimeApi.Profile.links( username ),
        UniversimeApi.Profile.favorites( username ),
        isOwnProfile ? UniversimeApi.Capacity.Folder.assignments( { assignedTo: username } ) : Promise.resolve( undefined ),
        UniversimeApi.Profile.educations( username ),
        UniversimeApi.Profile.experiences( username ),
        isOwnProfile ? UniversimeApi.Capacity.Folder.assignments({ assignedBy: username }) : Promise.resolve(undefined),
    ]);

    return {
        profile: fetchProfile.data,
        accessingLoggedUser: fetchProfile.data.user.ownerOfSession,
        allTypeCompetence: fetchCompetenceTypes.data ?? [],
        allTypeEducation: fetchEducationTypes.data ?? [],
        allTypeExperience: fetchExperienceTypes.data ?? [],
        allInstitution: fetchInstitutions.data ?? [],

        profileListData: {
            competences: fetchCompetences.data ?? [],
            education: fetchEducations.data ?? [],
            experience: fetchExperiences.data ?? [],
            // folders: fetchAssignements?.isSuccess() ? removeFalsy(fetchAssignements.data).map( f => f.folder ) : [],
            folders: fetchAssignements?.isSuccess() ? removeFalsy(fetchAssignements.data).map( f => f.folder ) : null,
            favorites: fetchFavorites.isSuccess() ? removeFalsy(fetchFavorites.body).map( f => f.folder ) : [],
            groups: fetchGroups.data?.sort((g1, g2) => {
                if (g1.rootGroup && !g2.rootGroup) {
                    return -1; 
                } else if (!g1.rootGroup && g2.rootGroup) {
                    return 1; 
                } else {
                    return g1.name.localeCompare(g2.name);
                }
            }) ?? [],
            links: fetchLinks.data ?? [],
            assignedByMe: fetchAssignedByMe?.data ?? [],
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
