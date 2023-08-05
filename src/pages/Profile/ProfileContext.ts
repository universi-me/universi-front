import { createContext } from "react"
import type { Profile } from "@/types/Profile";
import type { Group } from "@/types/Group";
import type { Competence } from "@/types/Competence";
import { Recommendation } from "@/types/Recommendation";

export type ProfileContextType = null | {
    accessingLoggedUser: boolean;

    profile:         Profile;
    allCompetences:  Competence[];
    profileListData: {
        groups:                  Group[];
        competences:             Competence[];
        links:                   any[]; // todo: typed links
        recommendationsSend:     Recommendation[];
        recommendationsReceived: Recommendation[];
    };

    reloadPage: () => void | Promise<void>;
}

export const ProfileContext = createContext<ProfileContextType>(null);
