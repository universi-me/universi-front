import { createContext } from "react"
import type { ProfileClass } from "@/types/Profile";
import type { Group } from "@/types/Group";
import type { Competence, CompetenceType, Level } from "@/types/Competence";
import type { Recommendation } from "@/types/Recommendation";
import type { Link } from "@/types/Link";
import type { Achievements } from "@/types/Achievements";
import type { Folder } from "@/types/Capacity";
import { Education } from "@/types/Education";
import { Experience } from "@/types/Experience";
import { Institution } from "@/types/Institution";
import { TypeEducation } from "@/types/TypeEducation";
import { TypeExperience } from "@/types/TypeExperience";

export type ProfileContextType = null | {
    accessingLoggedUser: boolean;

    profile:        ProfileClass;
    editCompetence: Competence | null;
    editEducation:  Education | null;
    editExperience: Experience | null;

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
    };

    setEditCompetence(competence: Competence | null): any;
    setEditEducation(education: Education | null): any;
    setEditExperience(experience: Experience | null): any;
    reloadPage: () => Promise<ProfileContextType>;
}

export const ProfileContext = createContext<ProfileContextType>(null);
