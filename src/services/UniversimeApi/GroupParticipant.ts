import { createApiInstance } from "./api";
import { ApiResponse } from "@/utils/apiUtils";

const api = createApiInstance( "/group/participants" )

export function join( groupId: string ) {
    return api.patch<boolean>( `/join/${groupId}` ).then( ApiResponse.new );
}

export function leave( groupId: string ) {
    return api.patch<boolean>( `/leave/${groupId}` ).then( ApiResponse.new );
}

export function add( body: GroupParticipantUpdate_RequestDTO ) {
    return api.patch<boolean>( `/add`, body ).then( ApiResponse.new );
}

export function remove( body: GroupParticipantUpdate_RequestDTO ) {
    return api.patch<boolean>( `/remove`, body ).then( ApiResponse.new );
}

export function changeParticipants( id: string, body: GroupParticipantChange_RequestDTO ) {
    return api.patch<void>( `/${encodeURIComponent(id)}/change`, body ).then( ApiResponse.new );
}

export function get( groupId: string ) {
    return api.get<Profile.DTO[]>( `/${groupId}` ).then( ApiResponse.new );
}

export function filter( body: GroupParticipantFilter_RequestDTO ) {
    return api.post<Profile.DTO[]>( `/filter`, body ).then( ApiResponse.new );
}

export function competences( groupId: string ) {
    return api.get<Group.CompetenceInfo[]>( `/competences/${groupId}` ).then( ApiResponse.new );
}


export type GroupParticipantUpdate_RequestDTO = {
    groupId: string;
    participant: string;
};

export type GroupParticipantChange_RequestDTO = {
    remove?: string[];
    add?: {
        profile: string;
        role?: string;
    }[];
};

export type GroupParticipantFilter_RequestDTO = {
    competences: {
        id: string;
        level: number;
    }[];
    matchEveryCompetence: boolean;
    groupId?: string;
    groupPath?: string;
};
