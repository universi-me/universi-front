import type { Folder, Content, FolderProfile, WatchProfileProgress } from "@/types/Capacity";
import type { ApiResponse } from "@/types/UniversimeApi";
import type { Profile } from "@/types/Profile";
import { createApiInstance } from "../api";

const api = createApiInstance( "/capacity/folder" )

export type FolderId_RequestDTO = {
    id: string;
    reference?: string;
} | {
    id?: string;
    reference: string;
};

export type FolderCreate_RequestDTO = {
    name:                string;
    image?:              string | null;
    description?:        string;
    rating?:             number;
    addCategoriesByIds?: string | string[];
    addCompetenceTypeBadgeIds?: string[];
    groupId?:            string;
    groupPath?:          string;
};

export type FolderEdit_RequestDTO = {
    id?:                    string;
    reference?:             string;
    name?:                  string;
    image?:                 string;
    description?:           string;
    rating?:                number;
    removeCategoriesByIds?: string | string[];
    addCategoriesByIds?:    string | string[];
    addGrantedAccessGroupByIds?:    string | string[];
    removeGrantedAccessGroupByIds?: string | string[];
    addCompetenceTypeBadgeIds?:     string[];
    removeCompetenceTypeBadgeIds?:  string[];
};

export type FolderFavorite_RequestDTO = {
    folderId?: string;
    reference?: string;
}

export type FolderUnfavorite_RequestDTO = {
    folderId?: string;
    reference?: string;
}

export type ContentAndFolder_RequestDTO = {
    folderId?:  string;
    reference?: string;
    contentIds: string | string[];
};

export type FolderAssignedTo_RequestDTO = {
    folderId?: string;
    reference?: string;
};

export type FoldersAssignedBy_RequestDTO = {
    profileId?: string;
    username?: string;
};

export type FolderWatchProgress_RequestDTO = {
    profileId?: string;
    username?: string;
    folderId?: string;
    folderReference?: string;
};

export type FolderMoveToGroup_RequestDTO = {
    folderReference:   string;
    originalGroupPath: string;
    newGroupPath:      string;
};

export type AssignContent_RequestDTO = {
    folderId?: string;
    reference?: string;
    profilesIds : string | string[];
}

export type UnassignContent_RequestDTO = {
    folderId?:   string;
    reference?:  string;
    profilesIds: string | string[];
}

export type DuplicateContent_RequestDTO = {
    contentId :         string,
    targetGroupId? :   string,
    targetGroupPath? : string
}

export type FolderGet_ResponseDTO =               ApiResponse<{ folder: Folder }>;
export type FolderCreate_ResponseDTO =            ApiResponse<{ contentId : string }>;
export type FolderEdit_ResponseDTO =              ApiResponse;
export type FolderRemove_ResponseDTO =            ApiResponse;
export type ListContentsInFolder_ResponseDTO =    ApiResponse<{ contents: Content[] }>;
export type AddContentToFolder_ResponseDTO =      ApiResponse;
export type RemoveContentFromFolder_ResponseDTO = ApiResponse;
export type FolderFavorite_ResponseDTO =          ApiResponse;
export type FolderUnfavorite_ResponseDTO =        ApiResponse;
export type FolderAssignedTo_ResponseDTO =        ApiResponse<{ profilesIds: Profile[] }>;
export type FoldersAssignedBy_ResponseDTO =       ApiResponse<{ folders: FolderProfile[] }>;
export type FolderWatchProgress_ResponseDTO =     ApiResponse<{ folder: Folder, watching: Profile, contentWatches: WatchProfileProgress[] }>;
export type FolderMoveToGroup_ResponseDTO =       ApiResponse;
export type AssignContent_ResponseDTO =     ApiResponse;
export type UnassignContent_ResponseDTO =   ApiResponse;
export type FolderList_ResponseDTO =   ApiResponse<{ folders: Folder[] }>;

export async function getFolder(body: FolderId_RequestDTO) {
    return (await api.post<FolderGet_ResponseDTO>("/get", {
        id: body.id,
        reference: body.reference,
    })).data;
}

export async function createFolder(body: FolderCreate_RequestDTO) {
    return (await api.post<FolderCreate_ResponseDTO>("/create", {
        name:               body.name,
        image:              body.image,
        description:        body.description,
        rating:             body.rating,
        addCategoriesByIds: body.addCategoriesByIds,
        groupId:            body.groupId,
        groupPath:          body.groupPath,
        addCompetenceTypeBadgeIds: body.addCompetenceTypeBadgeIds,
    })).data;
}

export async function editFolder(body: FolderEdit_RequestDTO) {
    return (await api.post<FolderEdit_ResponseDTO>("/edit", {
        id:                    body.id,
        reference:             body.reference,
        name:                  body.name,
        image:                 body.image,
        description:           body.description,
        rating:                body.rating,
        removeCategoriesByIds: body.removeCategoriesByIds,
        addCategoriesByIds:    body.addCategoriesByIds,
        addGrantedAccessGroupByIds:    body.addGrantedAccessGroupByIds,
        removeGrantedAccessGroupByIds: body.removeGrantedAccessGroupByIds,
        addCompetenceTypeBadgeIds:     body.addCompetenceTypeBadgeIds,
        removeCompetenceTypeBadgeIds:  body.removeCompetenceTypeBadgeIds,
    })).data;
}

export async function removeFolder(body: FolderId_RequestDTO) {
    return (await api.post<FolderRemove_ResponseDTO>("/delete", {
        id: body.id,
        reference: body.reference,
    })).data;
}

export async function contentsInFolder(body: FolderId_RequestDTO) {
    return (await api.post<ListContentsInFolder_ResponseDTO>("/contents", {
        id: body.id,
        reference: body.reference,
    })).data;
}

export async function addContentToFolder(body: ContentAndFolder_RequestDTO) {
    return (await api.post<AddContentToFolder_ResponseDTO>("/content/add", {
        id:         body.folderId,
        reference:  body.reference,
        contentIds: body.contentIds,
    })).data;
}

export async function removeContentFromFolder(body: ContentAndFolder_RequestDTO) {
    return (await api.post<RemoveContentFromFolder_ResponseDTO>("/content/remove", {
        id:         body.folderId,
        reference:  body.reference,
        contentIds: body.contentIds,
    })).data;
}

export async function favoriteFolder(body: FolderFavorite_RequestDTO) {
    return (await api.post<FolderFavorite_ResponseDTO>("/favorite", {
        folderId: body.folderId,
        reference: body.reference,
    })).data;
}

export async function unfavoriteFolder(body: FolderUnfavorite_RequestDTO) {
    return (await api.post<FolderUnfavorite_ResponseDTO>("/unfavorite", {
        folderId: body.folderId,
        reference: body.reference,
    })).data;
}

export async function folderAssignedTo(body: FolderAssignedTo_RequestDTO) {
    return (await api.post<FolderAssignedTo_ResponseDTO>("/assigned", {
        folderId: body.folderId,
        reference: body.reference,
    })).data;
}

export async function foldersAssignedBy(body: FoldersAssignedBy_RequestDTO) {
    return (await api.post<FoldersAssignedBy_ResponseDTO>("/assigned-by", {
        profileId: body.profileId,
        username: body.username,
    })).data;
}

export async function watchProfileProgress(body: FolderWatchProgress_RequestDTO) {
    return (await api.post<FolderWatchProgress_ResponseDTO>("/watch", {
        profileId: body.profileId,
        username: body.username,
        folderId: body.folderId,
        folderReference: body.folderReference,
    })).data;
}

export async function moveFolderToAnotherGroup(body: FolderMoveToGroup_RequestDTO) {
    const res = await api.post<FolderMoveToGroup_ResponseDTO>("/move-to-folder", {
        folderReference: body.folderReference,
        originalGroupPath: body.originalGroupPath,
        newGroupPath: body.newGroupPath,
    });

    return res.data;
}

export async function assignContent(body : AssignContent_RequestDTO){
    return(
        await api.post<AssignContent_ResponseDTO>("/assign", body)
    ).data;
}

export async function unassignContent(body: UnassignContent_RequestDTO) {
    return (await api.post<UnassignContent_ResponseDTO>("/unassign", {
        folderId:    body.folderId,
        reference:   body.reference,
        profilesIds: body.profilesIds,
    })).data;
}

export async function duplicateContent(body : DuplicateContent_RequestDTO){
    return (await api.post("/duplicate", body)).data;
}

export async function folderList() {
    return (await api.get<FolderList_ResponseDTO>("/all")).data;
}
