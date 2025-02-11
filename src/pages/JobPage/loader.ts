import { LoaderFunctionArgs } from "react-router-dom";
import { UniversimeApi } from "@/services"

export async function fetchJobPageData(id: string | undefined): Promise<JobPageLoaderResponse> {
    if (id === undefined) return {
        success: false,
        reason: "ID da vaga não informado.",
    };

    const [ jobRes ] = await Promise.all([
        UniversimeApi.Job.get( id ),
    ]);

    if (!jobRes.isSuccess()) return {
        success: false,
        reason: jobRes.errorMessage ?? "Não foi possível encontrar a vaga."
    };

    return {
        success: true,
        job: jobRes.data,
    };
}

export async function JobPageLoader(args: LoaderFunctionArgs) {
    const username = args.params["id"];
    return fetchJobPageData(username);
}

export type JobPageLoaderResponse = JobPageLoaderSuccess | JobPageLoaderFail;
type JobPageLoaderSuccess = {
    success: true;
    job: Job;
};

type JobPageLoaderFail = {
    success: false;
    reason: string;
};
