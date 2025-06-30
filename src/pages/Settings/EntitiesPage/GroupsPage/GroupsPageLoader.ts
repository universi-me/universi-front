import { UniversimeApi } from "@/services";
import { removeFalsy } from "@/utils/arrayUtils";

export async function GroupsPageLoaderFetch(): Promise<GroupsPageLoaderData> {
    const responses = await Promise.all( [
        UniversimeApi.GroupType.list(),
    ] );
    const [ groupTypes ] = responses;

    if ( responses.some( r => !r.isSuccess() ) ) return {
        success: false,
        reason: removeFalsy( responses.flatMap( r => r.error?.errors ) ),
    };

    else return {
        success: true,
        types: groupTypes.data!,
    };
}

export type GroupsPageLoaderData = {
    success: true;
    types: Group.Type[];
} | {
    success: false;
    reason: string[];
};
