import { UniversimeApi } from "@/services"
import { type CompetenceType } from "@/types/Competence";
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

    if (!competencesTypeResponse.success) {
        return {
            competenceTypes: undefined,
            errorReason: competencesTypeResponse.message,
        };
    }

    return {
        competenceTypes: competencesTypeResponse.body.list,
        errorReason: undefined,
    };
}

export async function CompetencesSettingsLoader(args: LoaderFunctionArgs) {
    return CompetencesSettingsFetch();
}
