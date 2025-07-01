import { createApiInstance } from "./api";
import { ApiResponse } from "@/utils/apiUtils";

const api = createApiInstance( "/group/settings/environments" )

export function update( body: GroupEnvironmentUpdate_RequestDTO ) {
    return api.patch<Group.Environment>( "", body ).then( ApiResponse.new );
}

export function get() {
    return api.get<Group.Environment>( "" ).then( ApiResponse.new );
}

export type GroupEnvironmentUpdate_RequestDTO = Partial<Group.Environment>;
