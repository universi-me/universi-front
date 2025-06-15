import { ApiResponse } from "@/utils/apiUtils";
import { createApiInstance } from "./api";

const api = createApiInstance( "/group/settings/admin" );


export function list( groupId: string ) {
    return api.get<Profile.DTO[]>( `/${groupId}/administrators` ).then( ApiResponse.new );
}
