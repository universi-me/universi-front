import { UniversimeApi } from "@/services";
import { removeFalsy } from "@/utils/arrayUtils";

export async function ActivitiesPageLoaderFetch(): Promise<ActivitiesPageLoaderData> {
    const responses = await Promise.all( [
        UniversimeApi.ActivityType.list(),
    ] );
    const [ activityTypes ] = responses;

    if ( responses.some( r => !r.isSuccess() ) ) return {
        success: false,
        reason: removeFalsy( responses.flatMap( r => r.error?.errors ) ),
    };

    else return {
        success: true,
        types: activityTypes.data!,
    };
}

export type ActivitiesPageLoaderData = {
    success: true;
    types: Activity.Type[];
} | {
    success: false;
    reason: string[];
};
