import { ReactNode, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { Profile } from "@/types/Profile";
import { UniversimeApi } from "@/services/UniversimeApi";
import { goTo } from "@/services/routes";
import type { Group } from "@/types/Group";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [organization, setOrganization] = useState<Group | null>(null);
  const [finishedLogin, setFinishedLogin] = useState<boolean>(false);
  const user = profile?.user ?? null;

  useEffect(() => {
    updateLoggedUser()
  }, []);

    return (
        <AuthContext.Provider value={{ user, signin, signout, signinGoogle, profile, updateLoggedUser, organization }}>
        { finishedLogin ? children : null }
        </AuthContext.Provider>
    );

    async function signin(email: string, password: string) {
        const response = await UniversimeApi.Auth.signin({ username: email, password });

        if (!response.success || response.body === undefined) {
            goTo("login");
            setFinishedLogin(true);
            return null;
        }

        setFinishedLogin(false);
        const logged = await updateLoggedUser();
        setFinishedLogin(true);
        return logged;
    }

    async function signinGoogle() {
        setFinishedLogin(false);

        const profile = await updateLoggedUser();

        if (profile === null) {
            goTo("login");
        }

        setFinishedLogin(true);
        return profile;
    };

    async function signout() {
        setFinishedLogin(false);

        await UniversimeApi.Auth.logout();
        setProfile(null);
        goTo("");

        setFinishedLogin(true);
    };

    async function updateLoggedUser() {
        setFinishedLogin(false);
        const profile = await getLoggedProfile();
        setProfile(profile);

        if (profile)
            updateOrganization();
        else
            setOrganization(null);

        setFinishedLogin(true);
        return profile;
    }

    async function updateOrganization() {
        const currentOrganization = await UniversimeApi.User.organization();
        const usedOrganization = currentOrganization.body?.organization ?? null;

        setOrganization(usedOrganization);
        return usedOrganization;
    }
};

async function getLoggedProfile() {
    if(!await UniversimeApi.Auth.validateToken()) {
        return null;
    }
    return (await UniversimeApi.Profile.profile()).body?.profile ?? null;
}
