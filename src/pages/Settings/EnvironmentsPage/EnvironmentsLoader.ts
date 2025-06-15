import { type LoaderFunctionArgs } from "react-router-dom";
import { UniversimeApi } from "@/services"
import { type GroupEnvironmentUpdate_RequestDTO } from "@/services/UniversimeApi/GroupEnvironment";

export type EnvironmentsLoaderResponse = {
    envDic: {
        [k in keyof GroupEnvironmentUpdate_RequestDTO]?: GroupEnvironmentUpdate_RequestDTO[k];
    };
};

export async function EnvironmentsFetch(): Promise<EnvironmentsLoaderResponse> {
    const environments = await UniversimeApi.GroupEnvironment.get();
    return {
        envDic: environments.data ?? {},
    }
}

export async function EnvironmentsLoader(args: LoaderFunctionArgs) {
    return EnvironmentsFetch();
}
