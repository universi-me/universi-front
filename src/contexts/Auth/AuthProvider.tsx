import { ReactNode, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { ProfileClass } from "@/types/Profile";
import { UniversimeApi } from "@/services/UniversimeApi";
import { goTo } from "@/configs/routes";
import type { Group } from "@/types/Group";
import type { Link } from "@/types/Link";
import { Nullable, Possibly } from "@/types/utils";
import ErrorPage from "@/components/ErrorPage";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [profile, setProfile] = useState<Possibly<ProfileClass>>();
    const [profileLinks, setProfileLinks] = useState<Link[]>([]);
    const [profileGroups, setProfileGroups] = useState<Group[]>([]);
    const [organization, setOrganization] = useState<Possibly<Group>>();
    const [isHealthy, setIsHealthy] = useState<boolean>();
    const user = profile?.user ?? null;

    useEffect(() => {
        updateLoggedUser();
        updateHealth();
    }, []);

    if (user?.needProfile) {
        goTo("/manage-profile");
    }

    if ( organization === undefined || isHealthy === undefined || profile === undefined )
        // Organization, status or user not fetched from the API yet
        return null;

    else if (organization === null)
        // Organization could not be fetched
        return <ErrorPage
            title="Estamos passando por problemas técnicos"
            description="No momento não é possível acessar o Universi.me, pedimos desculpas pelo imprevisto."
            hideBackToHome
        />

    else if ( isHealthy === false )
        // Some service is down
        return <ErrorPage
            title="Estamos passando por problemas técnicos"
            description={<>
                <p>Alguns dos serviços do Universi.me parecem estar fora do ar. Pedimos desculpas pelo imprevisto.</p>
                <p>Mais informações em <a href="/health" >nossa página de saúde de serviços</a>.</p>
            </>}
            hideBackToHome
        />

    return (
        <AuthContext.Provider value={{ user, signin, signout, signinGoogle, profile, updateLoggedUser, organization, profileGroups, profileLinks  }}>
        { children }
        </AuthContext.Provider>
    );

    async function signin(email: string, password: string, recaptchaToken: string | null) {
        const response = await UniversimeApi.Auth.signin({ username: email, password, recaptchaToken });

        if (!response.success || response.body === undefined) {
            goTo("login");
            return null;
        }

        return await updateLoggedUser();
    }

    async function signinGoogle() {
        const profile = await updateLoggedUser();

        if (profile === null) {
            goTo("login");
        }

        return profile;
    };

    async function signout() {
        await UniversimeApi.Auth.logout();
        await updateLoggedUser();

        goTo("");
    };

    async function updateLoggedUser() {
        let profile: Nullable<ProfileClass> = null;
        const organization = await updateOrganization();

        if (organization) {
            profile = await getLoggedProfile();

            await Promise.all([
                updateLinks(profile),
                updateGroups(profile),
            ]);

            setProfile(profile);
        }

        return profile;
    }

    async function updateOrganization() {
        const currentOrganization = await UniversimeApi.User.organization()
            .catch(err => null);

        const usedOrganization = currentOrganization?.body?.organization ?? null;

        setOrganization(usedOrganization);
        return usedOrganization;
    }

    async function updateLinks( profile: Possibly<ProfileClass> ) {
        if (!profile) {
            setProfileLinks([]);
            return [];
        }

        const fetchLinks = await UniversimeApi.Profile.links({ username: profile.user.name });
        const links = fetchLinks.success ? fetchLinks.body.links : [];

        setProfileLinks(links);
        return links;
    }

    async function updateGroups( profile: Possibly<ProfileClass> ) {
        if (!profile) {
            setProfileGroups([]);
            return [];
        }

        const fetchGroups = await UniversimeApi.Profile.groups({ username: profile.user.name });
        const groups = fetchGroups.success ? fetchGroups.body.groups : [];

        setProfileGroups(groups);
        return groups;
    }

    async function updateHealth() {
        const health = await UniversimeApi.Health.checkHealthAll();
        setIsHealthy( health.success );
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
