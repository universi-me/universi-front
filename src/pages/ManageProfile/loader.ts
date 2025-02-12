import { UniversimeApi } from "@/services"
import { ProfileClass, GENDER_OPTIONS } from "@/types/Profile";
import { TypeLinkToLabel } from "@/types/Link";

export type ManageProfileLoaderResponse = {
    profile: ProfileClass | null;
    links: Link[];

    genderOptions: {
        label: string,
        value: Gender | ""
    }[];
    typeLinks: {
        label: string
        value: TypeLink,
    }[];
};

export async function ManageProfileLoader(): Promise<ManageProfileLoaderResponse> {
    const genderOptions = Object.entries(GENDER_OPTIONS)
        .map(([value, label]) => {
            return {
                label,
                value: value as Gender | ""
            };
        })
        .concat([{
            label: "Prefiro não informar",
            value: ""
        }]);

    const typeLinks = Object.entries(TypeLinkToLabel)
        .map(tl => { return { value: tl[0] as TypeLink, label: tl[1] } })
        .sort((tl1, tl2) => tl1.label.localeCompare(tl2.label));

    const profileResponse = await UniversimeApi.Profile.profile();

    const profile = profileResponse.data ?? null;

    let links: Link[] = [];
    if ( profile ) {
        const linksRes = await UniversimeApi.Profile.links( profile.id );
        if ( linksRes.isSuccess() )
            links = linksRes.data;
    }

    return {
        profile: profile ? new ProfileClass(profile) : null,
        links,
        genderOptions,
        typeLinks,
    }
}
