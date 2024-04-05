import { RolesProfile, Roles } from "@/types/Roles";
import UniversimeApi from "@/services/UniversimeApi";

export type RolesResponse = {
    roles: Roles[] | undefined;
    participants: RolesProfile[] | undefined;
};

export async function RolesFetch(groupId: string): Promise<RolesResponse> {
    const profile = await UniversimeApi.Profile.profile();
    if (!profile.success) return FAILED_TO_LOAD;

    const roles = await UniversimeApi.Roles.list({ groupId });
    
    const participants = await UniversimeApi.Roles.listPaticipants({ groupId });

    if(!roles.success ) {
        return FAILED_TO_LOAD;
    }

    return {
        roles: roles.body?.roles,
        participants: participants.body?.participants,
    }
}

const FAILED_TO_LOAD = {
    roles: undefined,
    participants: undefined
};
