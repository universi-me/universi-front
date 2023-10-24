import { createContext } from "react"
import type { Profile } from "@/types/Profile";
import type { Group } from "@/types/Group";
import type { Competence, CompetenceType, Level } from "@/types/Competence";
import { Recommendation } from "@/types/Recommendation";
import { Link } from "@/types/Link";
import { Achievements } from "@/types/Achievements";
import { Education } from "@/types/Education";
import { Institution } from "@/types/Institution";
import { TypeEducation } from "@/types/TypeEducation";
import { Experience } from "@/types/Experience";
import { TypeExperience } from "@/types/TypeExperience";
import { Vacancy } from "@/types/Vacancy";
import { TypeVacancy } from "@/types/TypeVacancy";

export type ProfileContextType = null | {
    accessingLoggedUser: boolean;

    profile:        Profile;
    editCompetence: Competence | null;
    editEducation:  Education | null;
    editExperience: Experience | null;
    editVacancy: Vacancy | null;


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
        links:                   Link[];
        recommendationsSend:     Recommendation[];
        recommendationsReceived: Recommendation[];
        achievements:            Achievements[];
    };

    setEditCompetence(competence: Competence | null): any;
    setEditEducation(education: Education | null): any;
    setEditExperience(experience: Experience | null): any;
    setEditVacancy(vacancy: Vacancy | null): any;
    reloadPage: () => void | Promise<void>;
}

export const ProfileContext = createContext<ProfileContextType>(null);
