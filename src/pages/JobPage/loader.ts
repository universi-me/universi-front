import { LoaderFunctionArgs } from "react-router-dom";
import UniversimeApi from "@/services/UniversimeApi";
import { Job } from "@/types/Job";

export async function fetchJobPageData(id: string | undefined): Promise<JobPageLoaderResponse> {
    if (id === undefined) return {
        success: false,
        reason: "ID da vaga não informado.",
    };

    const [ jobRes ] = await Promise.all([
        UniversimeApi.Job.get({ jobId: id }),
    ]);

    if (!jobRes.success) return {
        success: false,
        reason: jobRes.message ?? "Não foi possível encontrar a vaga."
    };

    return {
        success: true,
        job: jobRes.body.job,
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
