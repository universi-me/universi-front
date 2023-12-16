import { createContext } from "react";
import { User } from "@/types/User";
import { type ProfileClass } from "@/types/Profile";
import type { Group } from "@/types/Group";

export type AuthContextType = {
    user : User | null;
    profile: ProfileClass | null;
    organization: Group | null;

    signin: (email : string, password: string, recaptchaToken: string | null) => Promise<ProfileClass | null>;
    signinGoogle: () => Promise<ProfileClass | null>;
    signout: () => Promise<void>;

    updateLoggedUser: () => Promise<ProfileClass | null>;
}

export const AuthContext = createContext<AuthContextType>(null!);
