import { ApiResponse } from "@/utils/apiUtils";
import { createApiInstance } from "../api";

const api = createApiInstance( "/capacity/contents" );


export function create( body: ContentCreate_RequestDTO ) {
    return api.post<Capacity.Content.DTO>( "", body ).then( ApiResponse.new );
}

export function update( contentId: string, body: ContentUpdate_RequestDTO ) {
    return api.patch<Capacity.Content.DTO>( `/${contentId}`, body ).then( ApiResponse.new );
}

export function remove( contentId: string ) {
    return api.delete<undefined>( `/${contentId}` ).then( ApiResponse.new );
}

export function get( contentId: string ) {
    return api.get<Capacity.Content.DTO>( `/${contentId}` ).then( ApiResponse.new );
}

export function list() {
    return api.get<Capacity.Content.DTO[]>( "" ).then( ApiResponse.new );
}

export function getStatus( contentId: string ) {
    return api.get<Capacity.Content.Status.DTO>( `/${contentId}/status` ).then( ApiResponse.new );
}

export function setStatus( contentId: string, body: ContentSetStatus_RequestDTO ) {
    return api.patch<Capacity.Content.Status.DTO>( `/${contentId}/status`, body ).then( ApiResponse.new );
}

export type ContentCreate_RequestDTO = {
    url: string;
    title: string;
    type: Capacity.Content.Type;
    image: Optional<string>;
    description: Optional<string>;
    rating: Capacity.Content.Rating;
    categoriesIds: Optional<string[]>;
    folders: Optional<string[]>;
};

export type ContentUpdate_RequestDTO = {
    url: Optional<string>;
    title: Optional<string>;
    type: Optional<Capacity.Content.Type>;
    image: Optional<string>;
    description: Optional<string>;
    rating: Optional<Capacity.Content.Rating>;
    categoriesIds: Optional<string[]>;
};

export type ContentSetStatus_RequestDTO = {
    contentStatusType: Capacity.Content.Status.Type;
};
