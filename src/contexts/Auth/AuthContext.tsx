import { createContext } from "react";
import { type ProfileClass } from "@/types/Profile";

export type AuthContextType = {
    user : User | null;
    profile: ProfileClass | null;
    profileLinks: Link[];
    profileGroups: Group[];
    organization: Group;

    signin: (email : string, password: string, recaptchaToken: string | null) => Promise<ProfileClass | null>;
    signinGoogle: () => Promise<ProfileClass | null>;
    signout: () => Promise<void>;

    updateLoggedUser: () => Promise<ProfileClass | null>;
}

export const AuthContext = createContext<AuthContextType>(null!);
