import { createContext } from "react";
import { User } from "@/types/User";
import { Profile } from "@/types/Profile";

export type AuthContextType = {
    user : User | null;
    profile: Profile | null;

    signin: (email : string, password: string) => Promise<{status : boolean, user : User}>;
    signin_google: (user: any) => Promise<boolean>;
    signout: () => void;
}

export const AuthContext = createContext<AuthContextType>(null!);