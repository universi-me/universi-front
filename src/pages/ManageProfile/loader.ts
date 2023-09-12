import { GENDER_OPTIONS } from "@/utils/profileUtils";
import { Gender } from "@/types/Profile";

export type ManageProfileLoaderResponse = {
    genderOptions: {
        label: string,
        value: Gender | ""
    }[];
};

export function ManageProfileLoader(): ManageProfileLoaderResponse {
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

    return {
        genderOptions,
    }
}
