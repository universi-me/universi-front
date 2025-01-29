import { createApiInstance } from "./api";
import { ApiResponse } from "@/utils/apiUtils";

const api = createApiInstance( "/group/settings/email-filters" )

export function create( body: GroupEmailFilterCreate_RequestDTO ) {
    return api.post<Group.EmailFilter.DTO>( "", body ).then( ApiResponse.new );
}

export function update( body: GroupEmailFilterUpdate_RequestDTO ) {
    return api.patch<Group.EmailFilter.DTO>( "", body ).then( ApiResponse.new );
}

export function remove( emailFilterId: string ) {
    return api.delete<undefined>( `/${emailFilterId}` ).then( ApiResponse.new );
}

export function list( groupId: string ) {
    return api.get<undefined>( `/${groupId}` ).then( ApiResponse.new );
}

export type GroupEmailFilterCreate_RequestDTO = {
    groupId: string;
    email: string;
    enabled: boolean;
    type: Group.EmailFilter.Type;
};

export type GroupEmailFilterUpdate_RequestDTO = {
    groupEmailFilterId: string;
    email: Optional<string>;
    enabled: Optional<boolean>;
    type: Optional<Group.EmailFilter.Type>;
};
