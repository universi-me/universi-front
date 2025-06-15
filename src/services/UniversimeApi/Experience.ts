import { ApiResponse } from "@/utils/apiUtils";
import { createApiInstance } from "./api";

const api = createApiInstance( "/experiences" )


export function create( body: ExperienceCreate_RequestDTO ) {
    return api.post<Experience.DTO>( "", body ).then( ApiResponse.new );
}

export function update( body: ExperienceUpdate_RequestDTO ) {
    return api.patch<Experience.DTO>( `/${body.experienceId}`, body ).then( ApiResponse.new );
}

export function remove( experienceId: string ) {
    return api.delete<undefined>( `/${experienceId}` ).then( ApiResponse.new );
}

export function get( experienceId: string ) {
    return api.get<Experience.DTO>( `/${experienceId}` ).then( ApiResponse.new );
}

export function list() {
    return api.get<Experience.DTO[]>( "" ).then( ApiResponse.new );
}

export type ExperienceCreate_RequestDTO = {
    experienceType: string;
    institution: string;
    description: string;
    startDate: string | number;
    endDate: Possibly<string | number>;
};

export type ExperienceUpdate_RequestDTO = {
    experienceId: string;
    experienceType: Optional<string>;
    institution: Optional<string>;
    description: Optional<string>;
    startDate: Optional<string | number>;
    endDate: Possibly<string | number>;
};
