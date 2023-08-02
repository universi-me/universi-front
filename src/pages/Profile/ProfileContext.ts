import { createContext } from "react"
import type { Profile } from "@/types/Profile";

export type ProfileContextType = null | {
    profile: Profile;
    accessingLoggedUser: boolean;
}

export const ProfileContext = createContext<ProfileContextType>(null);
