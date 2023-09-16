import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { Profile } from "@/types/Profile";
import { UniversimeApi } from "@/services/UniversimeApi";

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const user = profile?.user ?? null;

  useEffect(() => {
    updateLoggedUser()
  }, []);

    return (
        <AuthContext.Provider value={{ user, signin, signout, signinGoogle, profile, updateLoggedUser }}>
        {children}
        </AuthContext.Provider>
    );

    async function signin(email: string, password: string) {
        const response = await UniversimeApi.Auth.signin({ username: email, password });

        if (!response.success || response.body === undefined) {
            goTo("/login");
            return null;
        }

        const logged = (await getLoggedProfile())!;
        setProfile(logged);

        redirectAfterSignIn(logged.user.needProfile);
        return logged;
    }

    async function signinGoogle() {
        const profile = await updateLoggedUser();

        if (profile === null) {
            goTo("/login");
        }

        else {
            redirectAfterSignIn(profile.user.needProfile);
        }

        return profile;
    };

    async function signout() {
        await UniversimeApi.Auth.logout();
        setProfile(null);
        goTo("/");
    };

    async function updateLoggedUser() {
        const profile = await getLoggedProfile();
        setProfile(profile);

        return profile;
    }
};

async function getLoggedProfile() {
    return (await UniversimeApi.Profile.profile()).body?.profile ?? null;
}

function goTo(pathname: string) {
    if (window)
        window.location.href = `${window.location.origin}/${pathname}`;
}

function redirectAfterSignIn(needProfile: boolean) {
    goTo(needProfile ? "/manage-profile" : "/capacitacao");
}
