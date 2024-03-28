import { type LoaderFunctionArgs } from "react-router-dom";
import { useContext } from "react";
import { RolesProfile, Roles } from "@/types/Roles";
import UniversimeApi from "@/services/UniversimeApi";
import { AuthContext } from "@/contexts/Auth";

export type RolesResponse = {
    roles: Roles[] | undefined;
    participants: RolesProfile[] | undefined;
};

export async function RolesFetch(groupId: string): Promise<RolesResponse> {

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

export async function RolesLoader(args: LoaderFunctionArgs) {

    const auth = useContext(AuthContext);

    const organization = auth.organization;

    if (auth.profile === null || organization === null) {
        return {
            success: false,
            reason: null,
        };
    }

    return RolesFetch(organization!.id);
}

const FAILED_TO_LOAD = {
    roles: undefined,
    participants: undefined
};
