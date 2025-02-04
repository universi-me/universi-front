import { Roles } from "@/types/Roles";
import { UniversimeApi } from "@/services"
import { Profile } from "@/types/Profile";

export type RolesResponse = {
    roles: Roles[] | undefined;
    participants: Profile[] | undefined;
};

export async function RolesFetch(groupId: string): Promise<RolesResponse> {
    const profile = await UniversimeApi.Profile.profile();
    if (!profile.success) return FAILED_TO_LOAD;

    const roles = await UniversimeApi.Roles.list({ groupId });
    
    const participants = await UniversimeApi.Roles.listParticipants({ groupId });

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
