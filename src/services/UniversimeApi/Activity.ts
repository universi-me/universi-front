import { ApiResponse, URLSearchParamsIgnoreUndefined } from "@/utils/apiUtils";
import { createApiInstance } from "./api";

const api = createApiInstance( "/activities" );


export function get( activityId: string ) {
    return api.get<Activity.DTO>( `/${activityId}` ).then( ApiResponse.new );
}

export function list( body?: ActivityFilter_RequestDTO ) {
    return api.get<Activity.DTO[]>( "", { params: URLSearchParamsIgnoreUndefined( body ) } ).then( ApiResponse.new );
}

export function create( body: ActivityCreate_RequestDTO ) {
    return api.post<Activity.DTO>( "", body ).then( ApiResponse.new );
}

export function update( activityId: string, body: ActivityUpdate_RequestDTO ) {
    return api.patch<Activity.DTO>( `/${activityId}`, body ).then( ApiResponse.new );
}

export function remove( activityId: string ) {
    return api.delete<void>( `/${activityId}` ).then( ApiResponse.new );
}

export type ActivityFilter_RequestDTO = {
    type?: string;
    group?: string;
    status?: Activity.Status;

    startDate?: string;
    endDate?: string;
};

export type ActivityCreate_RequestDTO = {
    name: string;
    description: string;
    type: string;
    location: string;
    workload: number,
    badges?: string[],
    group: string;
    startDate: string | number;
    endDate: string | number;

    groupType: string;
    image?: string;
    bannerImage?: string;
};

export type ActivityUpdate_RequestDTO = {
    type?: string;
    location?: string;
    workload?: number,
    badges?: string[],
    startDate?: string | number;
    endDate?: string | number;
};

export type ActivityChangeParticipants_RequestDTO = {
    add?: string[];
    remove?: string[];
};
