import { createContext } from "react";
import type { ProfileClass } from "@/types/Profile";

export type ProfileContextType = null | {
    accessingLoggedUser: boolean;

    profile:        ProfileClass;

    /* If these values are not null and not undefined, it means something is beign edited.
     * If they are null, it means something is beign created.
     * If they are undefined, it means nothing is being created nor edited.
     */
    editCompetence: Competence | null | undefined;
    editEducation:  Education | null | undefined;
    editExperience: Experience | null | undefined;

    allInstitution:      Institution[];
    allTypeCompetence:  CompetenceType[];
    allTypeEducation:    TypeEducation[];
    allTypeExperience:   TypeExperience[];

    profileListData: {
        groups:                  Group[];
        education:               Education[];
        experience:              Experience[];
        competences:             Competence.DTO[];
        links:                   Link[];
        folders:                 Nullable<Folder[]>;
        favorites:               Folder[];
        assignedByMe:            FolderProfile[];
    };

    setEditCompetence(competence: Competence | null | undefined): any;
    setEditEducation(education: Education | null | undefined): any;
    setEditExperience(experience: Experience | null | undefined): any;
    reloadPage: () => Promise<ProfileContextType>;
}

export const ProfileContext = createContext<ProfileContextType>(null);
