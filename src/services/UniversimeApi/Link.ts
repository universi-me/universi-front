import { ApiResponse } from "@/utils/apiUtils";
import { createApiInstance } from "./api";

const api = createApiInstance( "/links" );


export function create( body: LinkCreate_RequestDTO ) {
    return api.post<Link.DTO>( "", body ).then( ApiResponse.new );
}

export function update( linkId: string, body: LinkUpdate_RequestDTO ) {
    return api.patch<Link.DTO>( `/${linkId}`, body ).then( ApiResponse.new );
}

export function remove( linkId: string ) {
    return api.delete<undefined>( `/${linkId}` ).then( ApiResponse.new );
}

export function get( linkId: string ) {
    return api.get<Link.DTO>( `/${linkId}` ).then( ApiResponse.new );
}

export type LinkCreate_RequestDTO = {
    url: string;
    type: Link.Type;
    name: Optional<string>;
};

export type LinkUpdate_RequestDTO = {
    url: Optional<string>;
    type: Optional<Link.Type>;
    name: Optional<string>;
};
