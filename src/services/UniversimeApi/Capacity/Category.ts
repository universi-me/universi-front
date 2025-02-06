import { ApiResponse } from "@/utils/apiUtils";
import { createApiInstance } from "../api";

const api = createApiInstance( "/capacity/categories" )


export function create( body: CategoryCreate_RequestDTO ) {
    return api.post<Capacity.Category.DTO>( "", body ).then( ApiResponse.new );
}

export function update( categoryId: string, body: CategoryUpdate_RequestDTO ) {
    return api.patch<Capacity.Category.DTO>( `/${categoryId}`, body ).then( ApiResponse.new );
}

export function remove( categoryId: string ) {
    return api.delete<undefined>( `/${categoryId}` ).then( ApiResponse.new );
}

export function get( categoryId: string ) {
    return api.get<Capacity.Category.DTO>( `/${categoryId}` ).then( ApiResponse.new );
}

export function list() {
    return api.get<Capacity.Category.DTO[]>( "" ).then( ApiResponse.new );
}

export function contents( categoryId: string ) {
    return api.get<Capacity.Content.DTO[]>( `/${categoryId}/contents` ).then( ApiResponse.new );
}

export function folders( categoryId: string ) {
    return api.get<Capacity.Folder.DTO[]>( `/${categoryId}/folders` ).then( ApiResponse.new );
}

export type CategoryCreate_RequestDTO = {
    name: string;
    image?: string;
};

export type CategoryUpdate_RequestDTO = {
    name?: string;
    image?: string;
};
