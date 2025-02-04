import { ApiResponse } from "@/utils/apiUtils";
import { createApiInstance } from "./api";

const api = createApiInstance( "/competences" )


export function create( body: CompetenceCreate_RequestDTO ) {
    return api.post<Competence.DTO>( "", body ).then( ApiResponse.new );
}

export function update( competenceId: string, body: CompetenceUpdate_RequestDTO ) {
    return api.patch<Competence.DTO>( `/${competenceId}`, body ).then( ApiResponse.new );
}

export function remove( competenceId: string ) {
    return api.delete<undefined>( `/${competenceId}` ).then( ApiResponse.new );
}

export function get( competenceId: string ) {
    return api.get<Competence.DTO>( `/${competenceId}` ).then( ApiResponse.new );
}

export async function list() {
    return api.get<Competence.DTO[]>( "" ).then( ApiResponse.new );
}

export type CompetenceCreate_RequestDTO = {
    competenceTypeId: string;
    description: string;
    level: Competence.Level;
};

export type CompetenceUpdate_RequestDTO = {
    competenceTypeId?: string;
    description?: string;
    level?: Competence.Level;
};
