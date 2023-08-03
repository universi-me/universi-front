import { createContext } from "react"
import type { Profile } from "@/types/Profile";

export type ProfileContextType = null | {
    profile: Profile;
    accessingLoggedUser: boolean;

    reloadPage: () => void;
}

export const ProfileContext = createContext<ProfileContextType>(null);
