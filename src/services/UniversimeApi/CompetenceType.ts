import { ApiResponse } from "@/utils/apiUtils";
import { createApiInstance } from "./api";

const api = createApiInstance( "/competence-types" )


export function create( body: CompetenceTypeCreate_RequestDTO ) {
    return api.post<Competence.Type>( "", body ).then( ApiResponse.new );
}

export function update( competenceTypeId: string, body: CompetenceTypeUpdate_RequestDTO ) {
    return api.patch<Competence.Type>( `/${competenceTypeId}`, body ).then( ApiResponse.new );
}

export function remove( competenceTypeId: string ) {
    return api.delete<undefined>( `/${competenceTypeId}` ).then( ApiResponse.new );
}

export function get( competenceTypeId: string ) {
    return api.get<Competence.Type>( `/${competenceTypeId}` ).then( ApiResponse.new );
}

export function list() {
    return api.get<Competence.Type[]>( "" ).then( ApiResponse.new );
}

export function merge( body: CompetenceTypeMerge_RequestDTO ) {
    return api.patch<undefined>( "/merge", body ).then( ApiResponse.new );
}

export type CompetenceTypeCreate_RequestDTO = {
    name: string;
};

export type CompetenceTypeUpdate_RequestDTO = {
    name?: string;
    reviewed?: boolean;
};

export type CompetenceTypeMerge_RequestDTO = {
    removedCompetenceType: string;
    remainingCompetenceType: string;
};
