import type { Content } from "@/types/Capacity";
import type { ApiResponse } from "@/types/UniversimeApi";
import { api } from "../api";

export type ContentId_RequestDTO = {
    id: string;
};

export type ContentCreate_RequestDTO = {
    url:                 string;
    title:               string;
    description?:        string;
    type?:               string;
    addCategoriesByIds?: string | string[];
    addFoldersByIds?:    string | string[];
    rating?:             number;
    image?:              string;
};

export type ContentEdit_RequestDTO = {
    id:                     string;
    url?:                   string;
    title?:                 string;
    description?:           string;
    addCategoriesByIds?:    string | string[];
    removeCategoriesByIds?: string | string[];
    addFoldersByIds?:       string | string[];
    removeFoldersByIds?:    string | string[];
    rating?:                number;
    image?:                 string;
    type?:                  string;
};

export type ContentStatus_RequestDTO={
    contentId:              string;
}

export type ContentStatusEdit_RequestDTO={
    contentId            : string;
    contentStatusType    : string;
}

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

export type ContentGet_ResponseDTO =      ApiResponse<{content: Content}>;
export type ContentCreate_ResponseDTO =   ApiResponse;
export type ContentEdit_ResponseDTO =     ApiResponse;
export type ContentRemove_ResponseDTO =   ApiResponse;
export type AssignContent_ResponseDTO =   ApiResponse;
export type UnassignContent_ResponseDTO = ApiResponse;

export async function getContent(body: ContentId_RequestDTO) {
    return (await api.post<ContentGet_ResponseDTO>("/capacity/content/get", {
        id: body.id,
    })).data;
}

export async function createContent(body: ContentCreate_RequestDTO) {
    return (await api.post<ContentCreate_ResponseDTO>("/capacity/content/create", {
        url:                body.url,
        title:              body.title,
        image:              body.image,
        description:        body.description,
        rating:             body.rating,
        type:               body.type,
        addCategoriesByIds: body.addCategoriesByIds,
        addFoldersByIds:    body.addFoldersByIds,
    })).data;
}

export async function editContent(body: ContentEdit_RequestDTO) {
    return (await api.post<ContentEdit_ResponseDTO>("/capacity/content/edit", {
        id:                    body.id,
        url:                   body.url,
        title:                 body.title,
        image:                 body.image,
        description:           body.description,
        rating:                body.rating,
        addCategoriesByIds:    body.addCategoriesByIds,
        removeCategoriesByIds: body.removeCategoriesByIds,
        addFoldersByIds:       body.addFoldersByIds,
        removeFoldersByIds:    body.removeFoldersByIds,
        type:                  body.type,
    })).data;
}

export async function removeContent(body: ContentId_RequestDTO) {
    return (await api.post<ContentRemove_ResponseDTO>("/capacity/content/delete", {
        id: body.id,
    })).data;
}

export async function createContentStatus(body : ContentStatus_RequestDTO){
    return(
        await api.post<ContentStatus_RequestDTO>("/capacity/content/status" ,{
            contentId : body.contentId,
        })
    ).data;
}

export async function editContentStatus(body : ContentStatusEdit_RequestDTO){
    return(
        await api.post<ContentStatusEdit_RequestDTO>("/capacity/content/status/edit", {
            contentId : body.contentId,
            contentStatusType : body.contentStatusType,
        })
    ).data;
}

export async function assignContent(body : AssignContent_RequestDTO){
    return(
        await api.post<AssignContent_ResponseDTO>("/capacity/folder/assign", body)
    ).data;
}

export async function unassignContent(body: UnassignContent_RequestDTO) {
    return (await api.post<UnassignContent_ResponseDTO>("/capacity/folder/unassign", {
        folderId:    body.folderId,
        reference:   body.reference,
        profilesIds: body.profilesIds,
    })).data;
}
