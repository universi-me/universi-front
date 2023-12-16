import UniversimeApi from "@/services/UniversimeApi";
import { LoaderFunctionArgs } from "react-router-dom";
import { type Profile } from "@/types/Profile";
import { type Optional } from "@/types/utils";

export type RolesPageLoaderResponse = {
    success: true,
    participants: Profile[];
} | {
    success: false,
    reason: Optional<string>,
};

export async function RolesPageFetch(organizationId: string): Promise<RolesPageLoaderResponse> {
    const participants = await UniversimeApi.Group.participants({ groupId: organizationId });

    if (!participants.success || !participants.body) {
        return {
            success: false,
            reason: participants.message,
        };
    }

    // if doesn't have access to accessLevel = not an admin
    if (participants.body.participants.find(p => p.user.accessLevel === undefined)) {
        return {
            success: false,
            reason: undefined,
        };
    }

    return {
        success: true,
        participants: participants.body.participants,
    };
}

export async function RolesPageLoader(args: LoaderFunctionArgs): Promise<RolesPageLoaderResponse> {
    const organization = await UniversimeApi.User.organization();

    if (!organization.success || !organization.body?.organization) {
        return {
            success: false,
            reason: organization.message,
        };
    }

    return RolesPageFetch(organization.body.organization.id);
}
