import { type LoaderFunctionArgs } from "react-router-dom";
import { UniversimeApi } from "@/services"

export type GroupEmailFilterLoaderResponse = {
    emailFilters: GroupEmailFilter[] | undefined;
};

export async function GroupEmailFilterFetch(organizationId: string): Promise<GroupEmailFilterLoaderResponse> {
    const filters = await UniversimeApi.GroupEmailFilter.list( organizationId );

    return {
        emailFilters: filters.data,
    }
}

export async function GroupEmailFilterLoader(args: LoaderFunctionArgs) {
    const org = await UniversimeApi.Group.currentOrganization();
    if (!org.isSuccess()) {
        return FAILED_TO_LOAD;
    }

    return GroupEmailFilterFetch(org.data.id!);
}

const FAILED_TO_LOAD = {
    emailFilters: undefined,
};
