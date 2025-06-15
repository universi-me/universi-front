import { ApiResponse } from "@/utils/apiUtils";
import { createApiInstance } from "./api";

const api = createApiInstance( "/activity-types" );

export function get( activityType: string ) {
    return api.get<Activity.Type>( `/${activityType}` ).then( ApiResponse.new );
}

export function list() {
    return api.get<Activity.Type[]>( "" ).then( ApiResponse.new );
}

export function create( body: ActivityTypeCreate_RequestDTO ) {
    return api.post<Activity.Type>( "", body ).then( ApiResponse.new );
}

export function update( activityType: string, body: ActivityTypeUpdate_RequestDTO ) {
    return api.patch<Activity.Type>( `/${activityType}`, body ).then( ApiResponse.new );
}

export function remove( activityType: string ) {
    return api.delete<void>( `/${activityType}` ).then( ApiResponse.new );
}

export type ActivityTypeCreate_RequestDTO = {
    name: string;
};

export type ActivityTypeUpdate_RequestDTO = {
    name?: string;
};
