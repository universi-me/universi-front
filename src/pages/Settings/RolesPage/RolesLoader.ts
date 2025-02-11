import { UniversimeApi } from "@/services"
import { LoaderFunctionArgs } from "react-router-dom";

export type RolesPageLoaderResponse = {
    success: true,
    participants: Profile[];
} | {
    success: false,
    reason: Optional<string>,
};

export async function RolesPageFetch(organizationId: string): Promise<RolesPageLoaderResponse> {
    const participants = await UniversimeApi.GroupParticipant.get( organizationId );

    if (!participants.isSuccess() || !participants.body) {
        return {
            success: false,
            reason: participants.errorMessage,
        };
    }

    // if doesn't have access to accessLevel = not an admin
    if (participants.data.find(p => p.user.accessLevel === undefined)) {
        return {
            success: false,
            reason: undefined,
        };
    }

    return {
        success: true,
        participants: participants.data,
    };
}

export async function RolesPageLoader(args: LoaderFunctionArgs): Promise<RolesPageLoaderResponse> {
    const organization = await UniversimeApi.Group.currentOrganization();

    if ( !organization.isSuccess() ) {
        return {
            success: false,
            reason: organization.errorMessage,
        };
    }

    return RolesPageFetch(organization.data.id!);
}
