import { createContext } from "react"
import type { ProfileClass } from "@/types/Profile";
import type { Group } from "@/types/Group";
import type { Competence, CompetenceType, Level } from "@/types/Competence";
import type { Recommendation } from "@/types/Recommendation";
import type { Link } from "@/types/Link";
import type { Achievements } from "@/types/Achievements";
import type { Folder, FolderProfile } from "@/types/Capacity";
import { Education } from "@/types/Education";
import { Experience } from "@/types/Experience";
import { Institution } from "@/types/Institution";
import { TypeEducation } from "@/types/TypeEducation";
import { TypeExperience } from "@/types/TypeExperience";

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
        competences:             Competence[];
        links:                   Link[];
        recommendationsSend:     Recommendation[];
        recommendationsReceived: Recommendation[];
        achievements:            Achievements[];
        folders:                 Folder[];
        favorites:               Folder[];
        assignedByMe:            FolderProfile[];
    };

    setEditCompetence(competence: Competence | null | undefined): any;
    setEditEducation(education: Education | null | undefined): any;
    setEditExperience(experience: Experience | null | undefined): any;
    reloadPage: () => Promise<ProfileContextType>;
}

export const ProfileContext = createContext<ProfileContextType>(null);
