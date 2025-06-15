import { UniversimeApi } from "@/services"

export type RolesResponse = {
    roles: Role.DTO[] | undefined;
    participants: Profile.DTO[] | undefined;
};

export async function RolesFetch(groupId: string): Promise<RolesResponse> {
    const profile = await UniversimeApi.Profile.profile();
    if (!profile.isSuccess()) return FAILED_TO_LOAD;

    const roles = await UniversimeApi.Group.roles( groupId );
    
    const participants = await UniversimeApi.Role.getParticipantsRoles( groupId );

    if(!roles.isSuccess() ) {
        return FAILED_TO_LOAD;
    }

    return {
        roles: roles.data,
        participants: participants.data?.map( p => ({
            ...p.profile,
            role: p.role,
        })) ?? [],
    }
}

const FAILED_TO_LOAD = {
    roles: undefined,
    participants: undefined
};
