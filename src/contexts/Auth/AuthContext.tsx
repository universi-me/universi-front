import { createContext } from "react";
import { User } from "@/types/User";
import { Profile } from "@/types/Profile";

export type AuthContextType = {
    user : User | null;
    profile: Profile | null;

    signin: (email : string, password: string) => Promise<Profile | null>;
    signinGoogle: () => Promise<Profile | null>;
    signout: () => void;

    updateLoggedUser: () => Promise<Profile | null>;
}

export const AuthContext = createContext<AuthContextType>(null!);
