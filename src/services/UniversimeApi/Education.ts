import { ApiResponse } from "@/utils/apiUtils";
import { createApiInstance } from "./api";

const api = createApiInstance( "/educations" );


export function update( educationId: string, body: EducationUpdate_RequestDTO ) {
    return api.patch<Education.DTO>( `/${educationId}`, body ).then( ApiResponse.new );
}

export function create( body: EducationCreate_RequestDTO ) {
    return api.post<Education.DTO>( "", body ).then( ApiResponse.new );
}

export function get( educationId: string ) {
    return api.get<Education.DTO>( `/${educationId}` ).then( ApiResponse.new );
}

export function list() {
    return api.get<Education.DTO[]>( "" ).then( ApiResponse.new );
}

export async function remove( educationId: string ) {
    return api.delete<undefined>( `/${educationId}` ).then( ApiResponse.new );
}

export type EducationUpdate_RequestDTO = {
    educationType: Optional<string>;
    institution: Optional<string>;
    startDate: Optional<string>;
    endDate: Possibly<string>;
};

export type EducationCreate_RequestDTO = {
    educationType: string;
    institution: string;
    startDate: string;
    endDate: Possibly<string>;
};
