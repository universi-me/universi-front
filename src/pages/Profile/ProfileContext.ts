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

export type ProfileContextType = null | {
    accessingLoggedUser: boolean;

    profile:        Profile;
    editCompetence: Competence | null;
    editEducation: Education | null;


    allInstitution:      Institution[];
    allCompetenceTypes:  CompetenceType[];
    allTypeEducation:    TypeEducation[];

    profileListData: {
        groups:                  Group[];
        education:               Education[];
        competences:             Competence[];
        links:                   Link[];
        recommendationsSend:     Recommendation[];
        recommendationsReceived: Recommendation[];
        achievements:            Achievements[];
    };

    reloadPage: () => void | Promise<void>;
}

export const ProfileContext = createContext<ProfileContextType>(null);
