import { createContext } from "react"
import type { Profile } from "@/types/Profile";
import type { Group } from "@/types/Group";
import type { Competence, CompetenceType, Level } from "@/types/Competence";
import { Recommendation } from "@/types/Recommendation";
import { Link } from "@/types/Link";
import { Achievements } from "@/types/Achievements";

export type ProfileContextType = null | {
    accessingLoggedUser: boolean;

    profile:        Profile;
    editCompetence: Competence | null;

    allCompetenceTypes:  CompetenceType[];
    profileListData: {
        groups:                  Group[];
        competences:             Competence[];
        links:                   Link[];
        recommendationsSend:     Recommendation[];
        recommendationsReceived: Recommendation[];
        achievements:            Achievements[];
    };

    reloadPage: () => void | Promise<void>;
}

export const ProfileContext = createContext<ProfileContextType>(null);
