import { ReactNode, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { ProfileClass } from "@/types/Profile";
import { UniversimeApi } from "@/services/UniversimeApi";
import { goTo } from "@/services/routes";
import type { Group } from "@/types/Group";
import type { Link } from "@/types/Link";
import { getRoles, saveRolesLocalStorage, removeRolesLocalStorage } from "@/utils/roles/rolesUtils";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<ProfileClass | null>(null);
  const [profileLinks, setProfileLinks] = useState<Link[]>([]);
  const [profileGroups, setProfileGroups] = useState<Group[]>([]);
  const [organization, setOrganization] = useState<Group | null>(null);
  const [finishedLogin, setFinishedLogin] = useState<boolean>(false);
  const user = profile?.user ?? null;
  const [roles, setRoles] = useState<any>(profile && getRoles());

  useEffect(() => {
    updateLoggedUser()
  }, []);

  useEffect(() => {
    if(roles && Object.keys(roles).length !== 0) {
        saveRolesLocalStorage(roles);
    } else {
        removeRolesLocalStorage();
    }
  }, [roles]);

    if (user?.needProfile) {
        goTo("/manage-profile");
    }

    return (
        <AuthContext.Provider value={{ user, signin, signout, signinGoogle, profile, updateLoggedUser, organization, roles, profileGroups, profileLinks  }}>
        { finishedLogin ? children : null }
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
        await updateRoles();
        const logged = await updateLoggedUser();
        setFinishedLogin(true);
        return logged;
    }

    async function signinGoogle() {
        setFinishedLogin(false);
        await updateRoles();
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

        setRoles(null);

        goTo("");

        setFinishedLogin(true);
    };

    async function updateLoggedUser() {
        setFinishedLogin(false);
        const profile = await getLoggedProfile();
        setProfile(profile);

        const organization = await updateOrganization();

        if (profile !== null) await Promise.all([
            organization,
            updateLinks(profile),
            updateGroups(profile),
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

    async function updateRoles() {
        return UniversimeApi.Roles.listRoles().then((data : any) => {
            if(data.success && data.body.roles) {
                setRoles(data.body.roles);
                return data.body.roles;
            }
        });
    }

    async function updateLinks(profile: ProfileClass) {
        if (profile === null) return;
        const fetchLinks = await UniversimeApi.Profile.links({ username: profile.user.name });
        const links = fetchLinks.success ? fetchLinks.body.links : [];

        setProfileLinks(links);
        return links;
    }

    async function updateGroups(profile: ProfileClass) {
        if (profile === null) return;
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
