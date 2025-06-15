import { UniversimeApi } from "@/services"
import { LoaderFunctionArgs } from "react-router-dom";

export type CompetencesSettingsLoaderResponse = {
    competenceTypes: CompetenceType[];
    errorReason: undefined;
} | {
    competenceTypes: undefined;
    errorReason?: string;
};

export async function CompetencesSettingsFetch(): Promise<CompetencesSettingsLoaderResponse> {
    const competencesTypeResponse = await UniversimeApi.CompetenceType.list();

    if (!competencesTypeResponse.isSuccess()) {
        return {
            competenceTypes: undefined,
            errorReason: competencesTypeResponse.errorMessage,
        };
    }

    return {
        competenceTypes: competencesTypeResponse.data,
        errorReason: undefined,
    };
}

export async function CompetencesSettingsLoader(args: LoaderFunctionArgs) {
    return CompetencesSettingsFetch();
}
