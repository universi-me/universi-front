import { ApiResponse } from "@/utils/apiUtils";
import { createApiInstance } from "./api";

const api = createApiInstance( "/departments" );

export function list() {
    return api.get<Department.DTO[]>( "" ).then( ApiResponse.new );
}

export function get( id: string ) {
    return api.get<Department.DTO>( `${id}` ).then( ApiResponse.new );
}

export function create( body: DepartmentCreate_RequestDTO ) {
    return api.post<Department.DTO>( "", body ).then( ApiResponse.new )
}

export function update( id: string, body: DepartmentUpdate_RequestDTO ) {
    return api.patch<Department.DTO>( `${id}`, body ).then( ApiResponse.new )
}

export function remove( id: string ) {
    return api.delete<undefined>( `${id}` ).then( ApiResponse.new );
}

export type DepartmentCreate_RequestDTO = {
    name: string;
    acronym: string;
};

export type DepartmentUpdate_RequestDTO = {
    name?: string;
    acronym?: string;
};
