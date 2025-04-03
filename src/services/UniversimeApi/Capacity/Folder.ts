import { ApiResponse } from "@/utils/apiUtils";
import { createApiInstance } from "../api";

const api = createApiInstance( "/capacity/folders" )

export function create( body: FolderCreate_RequestDTO ) {
    return api.post<Capacity.Folder.DTO>( "", body ).then( ApiResponse.new );
}

export function update( folderId: string, body: FolderUpdate_RequestDTO ) {
    return api.patch<Capacity.Folder.DTO>( `/${folderId}`, body ).then( ApiResponse.new );
}

export function remove( folderId: string ) {
    return api.delete<undefined>( `/${folderId}` ).then( ApiResponse.new );
}

export function get( folderId: string ) {
    return api.get<Capacity.Folder.DTO>( `/${folderId}` ).then( ApiResponse.new );
}

export function list() {
    return api.get<Capacity.Folder.DTO[]>( "" ).then( ApiResponse.new );
}

export function contents( folderId: string ) {
    return api.get<Capacity.Content.DTO[]>( `/${folderId}/contents` ).then( ApiResponse.new );
}

export function changeContents( folderId: string, body: FolderChangeContents_RequestDTO ) {
    return api.patch<undefined>( `/${folderId}/content`, body ).then( ApiResponse.new );
}

export function moveContents( folderId: string, contentId: string, body: FolderMoveContent_RequestDTO ) {
    return api.patch<undefined>( `/${folderId}/content/${contentId}`, body ).then( ApiResponse.new );
}

export function changeAssignments( folderId: string, body: FolderChangeAssignments_RequestDTO ) {
    return api.patch<undefined>( `/${folderId}/assign`, body ).then( ApiResponse.new );
}

export function assignments( searchParams: FolderAssignmentsSearchParams ) {
    return api.get<Capacity.Folder.Assignment[]>( "/assignments", { params: searchParams } ).then( ApiResponse.new );
}

export function favorite( folderId: string ) {
    return api.patch<undefined>( `/${folderId}/favorite` ).then( ApiResponse.new );
}

export function unfavorite( folderId: string ) {
    return api.patch<undefined>( `/${folderId}/unfavorite` ).then( ApiResponse.new );
}

export function watch( folderId: string, profile: string ) {
    return api.get<Capacity.Content.WatchProgress[]>( `/${folderId}/watch/${profile}` ).then( ApiResponse.new );
}

export function duplicate( folderId: string, body: FolderDuplicate_RequestDTO ) {
    return api.post<Capacity.Folder.DTO>( `/${folderId}/duplicate`, body ).then( ApiResponse.new );
}

export function move( folderId: string, body: FolderMove_RequestDTO ) {
    return api.post<Capacity.Folder.DTO>( `/${folderId}/move`, body ).then( ApiResponse.new );
}

export type FolderCreate_RequestDTO = {
    name: string;
    image?: string;
    description?: string;
    rating: Capacity.Folder.Rating;
    publicFolder?: boolean;
    categoriesIds?: string[];
    grantedAccessGroupsIds?: string[];
    competenceTypeBadgeIds?: string[];
};

export type FolderUpdate_RequestDTO = {
    name?: string;
    image?: string;
    description?: string;
    rating?: Capacity.Folder.Rating;
    publicFolder?: boolean;
    categoriesIds?: string[];
    grantedAccessGroups?: string[];
    addGrantedAccessGroups?: string[];
    removeGrantedAccessGroups?: string[];
    competenceTypeBadgeIds?: string[];
};

export type FolderChangeContents_RequestDTO = {
    addContentsIds?: string[];
    removeContentsIds?: string[];
};

export type FolderMoveContent_RequestDTO = {
    moveTo: number;
};

export type FolderChangeAssignments_RequestDTO = {
    addProfileIds: string[];
    removeProfileIds: string[];
};

export type FolderAssignmentsSearchParams = {
    folder?: string;
    assignedBy?: string;
    assignedTo?: string;
};

export type FolderDuplicate_RequestDTO = {
    groups: string[];
};

export type FolderMove_RequestDTO = {
    originalGroupId: string;
    newGroupId: string;
};
