import { type LoaderFunctionArgs } from "react-router-dom";
import { type GroupEmailFilter } from "@/types/Group";
import { UniversimeApi } from "@/services"

export type GroupEmailFilterLoaderResponse = {
    emailFilters: GroupEmailFilter[] | undefined;
};

export async function GroupEmailFilterFetch(organizationId: string): Promise<GroupEmailFilterLoaderResponse> {
    const filters = await UniversimeApi.Group.listEmailFilter({ groupId: organizationId });

    return {
        emailFilters: filters.body?.emailFilters,
    }
}

export async function GroupEmailFilterLoader(args: LoaderFunctionArgs) {
    const org = await UniversimeApi.User.organization();
    if (!org.success || !org.body?.organization) {
        return FAILED_TO_LOAD;
    }

    return GroupEmailFilterFetch(org.body.organization.id);
}

const FAILED_TO_LOAD = {
    emailFilters: undefined,
};
