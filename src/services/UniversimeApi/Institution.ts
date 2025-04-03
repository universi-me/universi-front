import { ApiResponse } from "@/utils/apiUtils";
import { createApiInstance } from "./api";

const api = createApiInstance( "/institutions" )


export function create( body: InstitutionCreate_RequestDTO ) {
    return api.post<Institution.DTO>( "", body ).then( ApiResponse.new );
}

export function update( institutionId: string, body: InstitutionCreate_RequestDTO ) {
    return api.patch<Institution.DTO>( `/${institutionId}`, body ).then( ApiResponse.new );
}

export function remove( institutionId: string ) {
    return api.delete<undefined>( `/${institutionId}` ).then( ApiResponse.new );
}

export function get( institutionId: string ) {
    return api.get<Institution.DTO>( `/${institutionId}` ).then( ApiResponse.new );
}

export function list() {
    return api.get<Institution.DTO[]>( "" ).then( ApiResponse.new );
}

export type InstitutionCreate_RequestDTO = {
    name: string;
};
