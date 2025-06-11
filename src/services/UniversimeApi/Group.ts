import { createApiInstance } from "./api";
import { ApiResponse } from "@/utils/apiUtils";

const api = createApiInstance( "/groups" )

export function create( body: GroupCreate_RequestDTO ) {
    return api.post<Group.DTO>( "", body ).then( ApiResponse.new );
}

export function update( body: GroupUpdate_RequestDTO ) {
    return api.patch<Group.DTO>( "", body ).then( ApiResponse.new );
}

export function removeSubgroup( parentGroupId: string, subgroupId: string ) {
    return api.delete<undefined>( `/${parentGroupId}/subgroups/${subgroupId}` ).then( ApiResponse.new );
}

export function remove( groupId: string ) {
    return api.delete<undefined>( `/${groupId}` ).then( ApiResponse.new );
}

export function get( groupId: string ) {
    return api.get<Group.DTO>( `/${groupId}` ).then( ApiResponse.new );
}

export function getFromPath( group: string ) {
    return api.get<Group.DTO>( "/from-path", { params: { group } } ).then( ApiResponse.new );
}

export function subgroups( groupId: string ) {
    return api.get<Group.DTO[]>( `/${groupId}/subgroups` ).then( ApiResponse.new );
}

export function availableParents() {
    return api.get<Group.DTO[]>( "/parents" ).then( ApiResponse.new );
}

export function folders( groupId: string ) {
    return api.get<Capacity.Folder.DTO[]>( `/${groupId}/folders` ).then( ApiResponse.new );
}

export function currentOrganization() {
    return api.get<Group.DTO>( "/current-organization" ).then( ApiResponse.new );
}

export function image( id: string ) {
    return api.get<unknown>( `/${id}/image` ).then( ApiResponse.new );
}

export function banner( id: string ) {
    return api.get<unknown>( `/${id}/banner` ).then( ApiResponse.new );
}

export function header( id: string ) {
    return api.get<unknown>( `/${id}/header` ).then( ApiResponse.new );
}

export function roles( id: string ) {
    return api.get<Role.DTO[]>( `/${id}/roles` ).then( ApiResponse.new );
}

export function activities( id: string ) {
    return api.get<Activity.DTO[]>( `/${id}/activities` ).then( ApiResponse.new );
}

export type GroupCreate_RequestDTO = {
    parentGroup?: string;
    nickname: string;
    name: string;
    image?: string;
    bannerImage?: string;
    headerImage?: string;
    description: string;
    groupType: string;
    canCreateSubgroup: boolean;
    isPublic: boolean;
    canJoin: boolean;
};

export type GroupUpdate_RequestDTO = {
    group: string;
    name?: string;
    image?: string;
    bannerImage?: string;
    headerImage?: string;
    description?: string;
    groupType?: string;
    canCreateSubgroup?: boolean;
    isPublic?: boolean;
    canJoin?: boolean;
};
