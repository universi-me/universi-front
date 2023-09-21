import { ReactNode, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { Profile } from "@/types/Profile";
import { UniversimeApi } from "@/services/UniversimeApi";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [finishedLogin, setFinishedLogin] = useState<boolean>(false);
  const user = profile?.user ?? null;

  useEffect(() => {
    updateLoggedUser()
  }, []);

    return (
        <AuthContext.Provider value={{ user, signin, signout, signinGoogle, profile, updateLoggedUser }}>
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
        const logged = (await getLoggedProfile())!;
        setProfile(logged);

        redirectAfterSignIn(logged.user.needProfile);
        setFinishedLogin(true);
        return logged;
    }

    async function signinGoogle() {
        setFinishedLogin(false);

        const profile = await updateLoggedUser();

        if (profile === null) {
            goTo("login");
        }

        else {
            redirectAfterSignIn(profile.user.needProfile);
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

        setFinishedLogin(true);
        return profile;
    }
};

async function getLoggedProfile() {
    return (await UniversimeApi.Profile.profile()).body?.profile ?? null;
}

function goTo(pathname: string) {
    if (!window)
        return;

    const destiny = `${window.location.origin}/${pathname}`;
    const alreadyThere = window.location.href === destiny;
    if (!alreadyThere)
        window.location.href = `${window.location.origin}/${pathname}`;
}

function redirectAfterSignIn(needProfile: boolean) {
    goTo(needProfile ? "manage-profile" : "capacitacao");
}
