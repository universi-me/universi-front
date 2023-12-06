import { type LoaderFunctionArgs } from "react-router-dom";
import UniversimeApi from "@/services/UniversimeApi";

export type EnvironmentsLoaderResponse = {
    envDic: {} | undefined;
};

export async function EnvironmentsFetch(): Promise<EnvironmentsLoaderResponse> {
    const environments = await UniversimeApi.Group.listEnvironments({});
    return { envDic: (environments as any).body.environments??{}, };
}

export async function EnvironmentsLoader(args: LoaderFunctionArgs) {
    return EnvironmentsFetch();
}
