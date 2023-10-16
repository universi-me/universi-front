import { createContext } from "react"
import type { Profile } from "@/types/Profile";
import type { Group } from "@/types/Group";
import type { Competence, CompetenceType, Level } from "@/types/Competence";
import type { Recommendation } from "@/types/Recommendation";
import type { Link } from "@/types/Link";
import type { Achievements } from "@/types/Achievements";
import type { Folder } from "@/types/Capacity";

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
        folders:                 Folder[];
    };

    reloadPage: () => void | Promise<void>;
}

export const ProfileContext = createContext<ProfileContextType>(null);
