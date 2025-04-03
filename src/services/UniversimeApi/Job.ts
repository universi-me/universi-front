import { ApiResponse } from "@/utils/apiUtils";
import { createApiInstance } from "./api";

const api = createApiInstance( "/jobs" );


export function create( body: JobCreate_RequestDTO ) {
    return api.post<Job.DTO>( "", body ).then( ApiResponse.new );
}

export function update( jobId: string, body: JobUpdate_RequestDTO ) {
    return api.patch<Job.DTO>( `/${jobId}`, body ).then( ApiResponse.new );
}

export function get( jobId: string ) {
    return api.get<Job.DTO>( `/${jobId}` ).then( ApiResponse.new );
}

export function list( searchParams: JobListSearchParams ) {
    return api.get<Job.DTO[]>( "", { params: searchParams } ).then( ApiResponse.new );
}

export function close( jobId: string ) {
    return api.patch<Job.DTO>( `/close/${jobId}` ).then( ApiResponse.new );
}

export type JobCreate_RequestDTO = {
    title: string;
    shortDescription: string;
    longDescription: string;
    institutionId: string;
    requiredCompetencesIds: string[];
};

export type JobUpdate_RequestDTO = {
    title: Optional<string>;
    shortDescription: Optional<string>;
    longDescription: Optional<string>;
    institutionId: Optional<string>;
    requiredCompetencesIds: Optional<string[]>;
};

export type JobListSearchParams = {
    onlyOpen?: boolean;
    competenceTypesIds?: string[];
};
