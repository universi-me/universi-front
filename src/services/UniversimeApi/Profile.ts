import { createApiInstance } from "./api";
import { ApiResponse } from "@/utils/apiUtils";

const api = createApiInstance( "/profiles" )

export type ProfileEdit_RequestDTO = {
    firstname?: string;
    lastname?: string;
    biography?: string;
    gender?: Profile.Gender;
    image?: string;
    password?: string;
};

export function profile() {
    return api.get<Profile.DTO>( "" ).then( ApiResponse.new );
}

export function get( idOrUsername: string ) {
    return api.get<Profile.DTO>( `/${idOrUsername}` ).then( ApiResponse.new );
}

export function update( body: ProfileEdit_RequestDTO ) {
    return api.patch<Profile.DTO>( "", body ).then( ApiResponse.new );
}

export function groups( idOrUsername: string ) {
    return api.get<Group.DTO[]>( `/${idOrUsername}/groups` ).then( ApiResponse.new );
}

export function competences( idOrUsername: string ) {
    return api.get<Competence.DTO[]>( `/${idOrUsername}/competences` ).then( ApiResponse.new );
}

export function educations( idOrUsername: string ) {
    return api.get<Education.DTO[]>( `/${idOrUsername}/educations` ).then( ApiResponse.new );
}

export function experiences( idOrUsername: string ) {
    return api.get<Experience.DTO[]>( `/${idOrUsername}/experiences` ).then( ApiResponse.new );
}

export function links( idOrUsername: string ) {
    return api.get<Link.DTO[]>( `/${idOrUsername}/links` ).then( ApiResponse.new );
}

export function folders( idOrUsername: string ) {
    return api.get<ProfileFoldersResponseDTO>( `/${idOrUsername}/folders` ).then( ApiResponse.new );
}

export function favorites( idOrUsername: string ) {
    return api.get<Capacity.Folder.Favorite[]>( `/${idOrUsername}/favorites` ).then( ApiResponse.new );
}

export function image( idOrUsername: string ) {
    return api.get<unknown>( `/${idOrUsername}/image` ).then( ApiResponse.new );
}

export type ProfileFoldersResponseDTO = {
    favorites: Capacity.Folder.Favorite[];
    assignments: Capacity.Folder.Assignment[];
};
