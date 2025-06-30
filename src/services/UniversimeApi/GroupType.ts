import { ApiResponse } from "@/utils/apiUtils";
import { createApiInstance } from "./api";

const api = createApiInstance( "/group-types" );

export function get( groupType: string ) {
    return api.get<Group.Type>( `/${groupType}` ).then( ApiResponse.new );
}

export function list() {
    return api.get<Group.Type[]>( "" ).then( ApiResponse.new );
}

export function create( body: GroupTypeCreate_RequestDTO ) {
    return api.post<Group.Type>( "", body ).then( ApiResponse.new );
}

export function update( groupType: string, body: GroupTypeUpdate_RequestDTO ) {
    return api.patch<Group.Type>( `/${groupType}`, body ).then( ApiResponse.new );
}

export function remove( groupType: string ) {
    return api.delete<void>( `/${groupType}` ).then( ApiResponse.new );
}

export type GroupTypeCreate_RequestDTO = {
    label: string;
};

export type GroupTypeUpdate_RequestDTO = {
    label?: string;
};
