import { createApiInstance } from "./api";
import { ApiResponse } from "@/utils/apiUtils";

const api = createApiInstance( "/group/settings/features" );


export function create( body: GroupFeatureCreate_RequestDTO ) {
    return api.post<Group.Feature.DTO>( "", body ).then( ApiResponse.new );
}

export function update( body: GroupFeatureUpdate_RequestDTO ) {
    return api.patch<Group.Feature.DTO>( "", body ).then( ApiResponse.new );
}

export function remove( featureId: string ) {
    return api.delete<undefined>( `/${featureId}` ).then( ApiResponse.new );
}

export function get( featureId: string ) {
    return api.get<Group.Feature.DTO>( `/${featureId}` ).then( ApiResponse.new );
}

export type GroupFeatureCreate_RequestDTO = {
    groupId: string;
    name: string;
    description: string;
    enabled: boolean;
};

export type GroupFeatureUpdate_RequestDTO = {
    groupFeatureId: string;
    description: Optional<string>;
    enabled: Optional<boolean>;
};
