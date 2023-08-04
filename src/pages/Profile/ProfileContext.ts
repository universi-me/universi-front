import { createContext } from "react"
import type { Profile } from "@/types/Profile";
import type { Group } from "@/types/Group";

export type ProfileContextType = null | {
    profile: Profile;
    accessingLoggedUser: boolean;
    groups: {[id: number]: Group | undefined};

    reloadPage: () => void;
}

export const ProfileContext = createContext<ProfileContextType>(null);
