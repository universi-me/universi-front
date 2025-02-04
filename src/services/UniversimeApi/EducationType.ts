import { ApiResponse } from "@/utils/apiUtils";
import { createApiInstance } from "./api";

const api = createApiInstance( "/education-types" )


export function create( body: EducationTypeCreate_RequestDTO ) {
    return api.post<Education.Type>( "", body ).then( ApiResponse.new );
}

export function get( educationTypeIdOrName: string ) {
    return api.get<Education.Type>( `/${educationTypeIdOrName}` ).then( ApiResponse.new );
}

export function update( educationTypeIdOrName: string, body: EducationTypeUpdate_RequestDTO ) {
    return api.patch<Education.Type>( `/${educationTypeIdOrName}`, body ).then( ApiResponse.new );
}

export function list() {
    return api.get<Education.Type[]>( "" ).then( ApiResponse.new );
}

export function remove( educationTypeIdOrName: string ) {
    return api.delete<undefined>( `/${educationTypeIdOrName}` ).then( ApiResponse.new );
}

export type EducationTypeCreate_RequestDTO = {
    name: string;
};

export type EducationTypeUpdate_RequestDTO = {
    name: Optional<string>;
};
