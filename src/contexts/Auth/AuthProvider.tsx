import { ReactNode, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { ProfileClass } from "@/types/Profile";
import { UniversimeApi } from "@/services/UniversimeApi";
import { goTo } from "@/services/routes";
import type { Group } from "@/types/Group";
import type { Link } from "@/types/Link";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [profile, setProfile] = useState<ProfileClass | null>(null);
    const [profileLinks, setProfileLinks] = useState<Link[]>([]);
    const [profileGroups, setProfileGroups] = useState<Group[]>([]);
    const [organization, setOrganization] = useState<Group | null>(null);
    const [finishedLogin, setFinishedLogin] = useState<boolean>(false);
    const user = profile?.user ?? null;

    useEffect(() => {
        updateLoggedUser()
    }, [profile]);

    if (user?.needProfile) {
        goTo("/manage-profile");
    }

    return (
        <AuthContext.Provider value={{ user, signin, signout, signinGoogle, profile, updateLoggedUser, organization, profileGroups, profileLinks  }}>
        { children }
        </AuthContext.Provider>
    );

    async function signin(email: string, password: string, recaptchaToken: string | null) {
        const response = await UniversimeApi.Auth.signin({ username: email, password, recaptchaToken });

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
        await updateLoggedUser();

        goTo("");

        setFinishedLogin(true);
    };

    async function updateLoggedUser() {
        setFinishedLogin(false);
        const profile = await getLoggedProfile();
        setProfile(profile);

        await Promise.all([
            updateOrganization(),
            updateLinks(),
            updateGroups(),
        ]);

        setFinishedLogin(true);
        return profile;
    }

    async function updateOrganization() {
        const currentOrganization = await UniversimeApi.User.organization();
        const usedOrganization = currentOrganization.body?.organization ?? null;

        setOrganization(usedOrganization);
        return usedOrganization;
    }

    async function updateLinks() {
        if (!profile) {
            setProfileLinks([]);
            return [];
        }

        const fetchLinks = await UniversimeApi.Profile.links({ username: profile.user.name });
        const links = fetchLinks.success ? fetchLinks.body.links : [];

        setProfileLinks(links);
        return links;
    }

    async function updateGroups() {
        if (!profile) {
            setProfileGroups([]);
            return [];
        }

        const fetchGroups = await UniversimeApi.Profile.groups({ username: profile.user.name });
        const groups = fetchGroups.success ? fetchGroups.body.groups : [];

        setProfileGroups(groups);
        return groups;
    }
};

async function getLoggedProfile() {
    if(!await UniversimeApi.Auth.validateToken()) {
        return null;
    }

    const responseProfile = (await UniversimeApi.Profile.profile()).body?.profile;
    return responseProfile
        ? new ProfileClass(responseProfile)
        : null;
}
