import { ReactNode, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { ProfileClass } from "@/types/Profile";
import { UniversimeApi } from "@/services";
import { goTo } from "@/configs/routes";
import ErrorPage from "@/components/ErrorPage";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [profile, setProfile] = useState<Possibly<ProfileClass>>();
    const [profileLinks, setProfileLinks] = useState<Link.DTO[]>([]);
    const [profileGroups, setProfileGroups] = useState<Group.DTO[]>([]);
    const [organization, setOrganization] = useState<Possibly<Group.DTO>>();
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

        if (!response.isSuccess() || response.data === undefined) {
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

    async function updateLoggedUser(): Promise<Nullable<ProfileClass>> {
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

    async function updateOrganization(): Promise<Nullable<Group.DTO>> {
        const currentOrganization = await UniversimeApi.Group.currentOrganization()
            .catch(err => null);

        const usedOrganization = currentOrganization?.body ?? null;

        setOrganization(usedOrganization);
        return usedOrganization;
    }

    async function updateLinks( profile: Possibly<ProfileClass> ): Promise<Link.DTO[]> {
        if (!profile) {
            setProfileLinks([]);
            return [];
        }

        const fetchLinks = await UniversimeApi.Profile.links( profile.user.name );
        const links = fetchLinks.data ?? [];

        setProfileLinks(links);
        return links;
    }

    async function updateGroups( profile: Possibly<ProfileClass> ): Promise<Group.DTO[]> {
        if (!profile) {
            setProfileGroups([]);
            return [];
        }

        const fetchGroups = await UniversimeApi.Profile.groups( profile.user.name );
        const groups = fetchGroups.data ?? [];

        setProfileGroups(groups);
        return groups;
    }

    async function updateHealth() {
        const health = await UniversimeApi.Health.checkHealthAll();
        setIsHealthy( health.isSuccess() );
    }
};

async function getLoggedProfile(): Promise<Nullable<ProfileClass>> {
    const account = await UniversimeApi.User.account();

    if( !account.isSuccess() ) {
        return null;
    }

    const res = await UniversimeApi.Profile.profile();
    return res.isSuccess()
        ? new ProfileClass( res.data )
        : null;
}
