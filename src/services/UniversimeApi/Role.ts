import { ApiResponse } from "@/utils/apiUtils";
import { createApiInstance } from "./api";
import { ProfileClass } from "@/types/Profile";

const api = createApiInstance( "/roles" )


export function create( body: RoleCreate_RequestDTO ) {
    return api.post<Role.DTO>( "", body ).then( ApiResponse.new );
}

export function update( body: RoleUpdate_RequestDTO ) {
    return api.patch<Role.DTO>( `/${body.rolesId}`, body ).then( ApiResponse.new );
}

export function remove( roleId: string ) {
    return api.delete<undefined>( `/${roleId}` ).then( ApiResponse.new );
}

export function assign( roleId: string, profile: string ) {
    return api.patch<undefined>( `/${roleId}/assign/${profile}` ).then( ApiResponse.new );
}

export function getAssigned( groupId: string, profile: string ) {
    return api.get<Role.DTO>( `/${groupId}/${profile}/role` ).then( ApiResponse.new );
}

export function getParticipantsRoles( groupId: string ) {
    return api.get<ProfileRoleDTO[]>( `/${groupId}/participants` ).then( ApiResponse.new );
}

export type RoleCreate_RequestDTO = {
    name: string;
    description: Optional<string>;
    group: string;
};

export type RoleUpdate_RequestDTO = {
    rolesId: string;
    name?: string;
    description?: string;
    group?: string;
    features?: {
        [ k in Role.Feature ]?: Role.Permission;
    };
};

export type ProfileRoleDTO = {
    profile: Profile;
    role: Role.DTO;
};