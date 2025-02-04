import { ApiResponse } from "@/utils/apiUtils";
import { createApiInstance } from "./api";

const api = createApiInstance( "/experience-types" )

export function create( body: ExperienceTypeCreate_RequestDTO ) {
    return api.post<Experience.Type>( "", body ).then( ApiResponse.new );
}

export function update( experienceTypeId: string, body: ExperienceTypeUpdate_RequestDTO ) {
    return api.patch<Experience.Type>( `/${experienceTypeId}`, body ).then( ApiResponse.new );
}

export function remove( experienceTypeId: string ) {
    return api.delete<undefined>( `/${experienceTypeId}` ).then( ApiResponse.new );
}

export function get( experienceTypeId: string ) {
    return api.get<Experience.Type>( `/${experienceTypeId}` ).then( ApiResponse.new );
}

export function list() {
    return api.get<Experience.Type[]>( "" ).then( ApiResponse.new );
}

export type ExperienceTypeCreate_RequestDTO = {
    name: string;
};

export type ExperienceTypeUpdate_RequestDTO = {
    name: Optional<string>;
};
