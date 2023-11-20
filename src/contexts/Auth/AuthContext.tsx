import { createContext } from "react";
import { User } from "@/types/User";
import { Profile } from "@/types/Profile";
import type { Group } from "@/types/Group";

export type AuthContextType = {
    user : User | null;
    profile: Profile | null;
    organization: Group | null;

    signin: (email : string, password: string, recaptchaToken: string | null) => Promise<Profile | null>;
    signinGoogle: () => Promise<Profile | null>;
    signout: () => Promise<void>;

    updateLoggedUser: () => Promise<Profile | null>;
}

export const AuthContext = createContext<AuthContextType>(null!);
