import type { Group, GroupType, GroupEmailFilter, GroupEmailFilterType } from "@/types/Group";
import type { Profile } from "@/types/Profile";
import type { ApiResponse } from "@/types/UniversimeApi";
import { createApiInstance } from "./api";
import { Folder } from "@/types/Capacity";

const api = createApiInstance( "/group" )

export type GroupId_RequestDTO = {
    groupId: string;
};

export type GroupCreate_RequestDTO = {
    name:            string;
    description:     string;
    nickname:        string;
    groupType:       GroupType;
    imageUrl?:       string;
    bannerImageUrl?: string;
    headerImageUrl?: string;
    canHaveSubgroup: boolean;
    isPublic:        boolean;
    canJoin:         boolean;
    isRootGroup:     boolean;
    parentGroupId?:  string;
};

export type GroupUpdate_RequestDTO = {
    groupId?:   string;
    groupPath?: string;

    name?:            string;
    description?:     string;
    groupType?:       GroupType;
    imageUrl?:        string;
    bannerImageUrl?:  string;
    headerImageUrl?:  string;
    canHaveSubgroup?: boolean;
    isPublic?:        boolean;
    canJoin?:         boolean;
    everyoneCanPost?: boolean;
};

export type GroupRemove_RequestDTO = {
    groupId?:       string;
    groupPath?:     string;
    groupIdRemove:  string;
}


export type GroupIdOrPath_RequestDTO = {
    groupId?:   string;
    groupPath?: string;
};

export type GroupEmailFilterAdd_RequestDTO = GroupIdOrPath_RequestDTO & {
    email:      string;
    isEnabled?: boolean;
    type?:      GroupEmailFilterType;
};

export type GroupEmailFilterEdit_RequestDTO = GroupIdOrPath_RequestDTO & {
    emailFilterId: string;
    email?:        string;
    isEnabled?:    boolean;
    type?:         GroupEmailFilterType;
};

export type GroupEmailFilterDelete_RequestDTO = GroupIdOrPath_RequestDTO & {
    emailFilterId: string;
};


export type FilterParticipants_RequestDTO = {
    competences:           {id: string, level: number}[],
    matchEveryCompetence:   boolean,
    groupId?:               string,
    groupPath?:             string
}

export type GroupThemeEdit_RequestDTO = GroupIdOrPath_RequestDTO & {
    primaryColor:           string;
    secondaryColor:         string;
    backgroundColor:        string;
    cardBackgroundColor:    string;
    cardItemColor:          string;
    fontColorV1:            string;
    fontColorV2:            string;
    fontColorV3:            string;
    fontColorLinks:         string;
    fontColorDisabled:      string;
    buttonHoverColor:       string;
    fontColorAlert:         string;
    fontColorSuccess:       string;
    wrongInvalidColor:      string;
};

export type GroupGet_ResponseDTO =                       ApiResponse<{ group: Group }>;
export type GroupCreate_ResponseDTO =                    ApiResponse;
export type GroupUpdate_ResponseDTO =                    ApiResponse;
export type GroupAvailableParents_ResponseDTO =          ApiResponse<{ groups: Group[] }>;
export type GroupSubgroups_ResponseDTO =                 ApiResponse<{ subgroups: Group[] }>;
export type GroupParticipants_ResponseDTO =              ApiResponse<{ participants: Profile[] }>;
export type GroupFilteredParticipants_ResponseDTO =      ApiResponse<{ filteredParticipants: Profile[] }>;
export type GroupJoin_ResponseDTO =                      ApiResponse;
export type GroupExit_ResponseDTO =                      ApiResponse;
export type GroupFolders_ResponseDTO =                   ApiResponse<{ folders: Folder[] }>;
export type GroupEmailFilterAdd_ResponseDTO =            ApiResponse;
export type GroupEmailFilterEdit_ResponseDTO =           ApiResponse;
export type GroupEmailFilterDelete_ResponseDTO =         ApiResponse;
export type GroupEmailFilterList_ResponseDTO =           ApiResponse<{ emailFilters: GroupEmailFilter[] }>;
export type GroupCompetencesList_ResponseDTO =           ApiResponse<competenceListResponse>
export type competenceListResponse = {competences : {competenceName : string, competenceTypeId : string, levelInfo : {[key : number]: Profile[]}}[]};
export type GroupThemeEdit_ResponseDTO =                 ApiResponse;


export async function get(body: GroupIdOrPath_RequestDTO) {
    return (await api.post<GroupGet_ResponseDTO>('/get', {
        groupId:   body.groupId,
        groupPath: body.groupPath,
    })).data;
}

export async function create(body: GroupCreate_RequestDTO) {
    return (await api.post<GroupCreate_ResponseDTO>("/create", {
        groupRoot:      body.isRootGroup,
        groupId:        body.parentGroupId,
        nickname:       body.nickname,
        name:           body.name,
        description:    body.description,
        imageUrl:       body.imageUrl,
        bannerImageUrl: body.bannerImageUrl,
        headerImageUrl: body.headerImageUrl,
        type:           body.groupType,
        canCreateGroup: body.canHaveSubgroup,
        publicGroup:    body.isPublic,
        canEnter:       body.canJoin,
    })).data;
}

export async function update(body: GroupUpdate_RequestDTO) {
    return (await api.post<GroupUpdate_ResponseDTO>("/update", {
        groupId:         body.groupId,
        groupPath:       body.groupPath,
        name:            body.name,
        description:     body.description,
        type:            body.groupType,
        imageUrl:        body.imageUrl,
        bannerImageUrl:  body.bannerImageUrl,
        headerImageUrl:  body.headerImageUrl,
        canCreateGroup:  body.canHaveSubgroup,
        publicGroup:     body.isPublic,
        canEnter:        body.canJoin,
        everyoneCanPost: body.everyoneCanPost,
    })).data;
}

export async function remove(body: GroupRemove_RequestDTO) {
    return (await api.post("/remove", body))
}

export async function availableParents() {
    return (await api.post<GroupAvailableParents_ResponseDTO>("/parents", {})).data;
}

export async function subgroups(body: GroupId_RequestDTO) {
    return (await api.post<GroupSubgroups_ResponseDTO>('/list', {
        groupId: body.groupId,
    })).data;
}

export async function participants(body: GroupId_RequestDTO) {
    return (await api.post<GroupParticipants_ResponseDTO>('/participant/list', {
        groupId: body.groupId,
    })).data;
}

export async function join(body: GroupId_RequestDTO) {
    return (await api.post<GroupJoin_ResponseDTO>('/participant/enter', {
        groupId: body.groupId,
    })).data;
}

export async function exit(body: GroupId_RequestDTO) {
    return (await api.post<GroupExit_ResponseDTO>('/participant/exit', {
        groupId: body.groupId,
    })).data;
}

export async function folders(body: GroupIdOrPath_RequestDTO) {
    return (await api.post<GroupFolders_ResponseDTO>("/folders", {
        groupId: body.groupId,
        groupPath: body.groupPath,
    })).data;
}

export async function addEmailFilter(body: GroupEmailFilterAdd_RequestDTO) {
    return (await api.post<GroupEmailFilterAdd_ResponseDTO>("/settings/email-filter/add", {
        groupId: body.groupId,
        groupPath: body.groupPath,
        email: body.email,
        enabled: body.isEnabled,
        type: body.type,
    })).data;
}

export async function editEmailFilter(body: GroupEmailFilterEdit_RequestDTO) {
    return (await api.post<GroupEmailFilterEdit_ResponseDTO>("/settings/email-filter/edit", {
        groupId: body.groupId,
        groupPath: body.groupPath,
        groupEmailFilterId: body.emailFilterId,
        email: body.email,
        enabled: body.isEnabled,
        type: body.type,
    })).data;
}

export async function deleteEmailFilter(body: GroupEmailFilterDelete_RequestDTO) {
    return (await api.post<GroupEmailFilterDelete_ResponseDTO>("/settings/email-filter/delete", {
        groupId: body.groupId,
        groupPath: body.groupPath,
        groupEmailFilterId: body.emailFilterId,
    })).data;
}

export async function listEmailFilter(body: GroupIdOrPath_RequestDTO) {
    return (await api.post<GroupEmailFilterList_ResponseDTO>("/settings/email-filter/list", {
        groupId: body.groupId,
        groupPath: body.groupPath,
    })).data;
}

export async function editTheme(body: GroupThemeEdit_RequestDTO) {
    return (await api.post<GroupThemeEdit_ResponseDTO>('/settings/theme/edit', {
        groupId:                    body.groupId,
        groupPath:                  body.groupPath,

        primary_color:              body.primaryColor,
        secondary_color:            body.secondaryColor,
        background_color:           body.backgroundColor,
        card_background_color:      body.cardBackgroundColor,
        card_item_color:            body.cardItemColor,
        font_color_v1:              body.fontColorV1,
        font_color_v2:              body.fontColorV2,
        font_color_v3:              body.fontColorV3,
        font_color_links:           body.fontColorLinks,
        font_color_disabled:        body.fontColorDisabled,
        button_hover_color:         body.buttonHoverColor,
        font_color_alert:           body.fontColorAlert,
        font_color_success:         body.fontColorSuccess,
        wrong_invalid_color:        body.wrongInvalidColor,
    })).data;
}

export async function editEnvironments(body: {}) {
    return (await api.post<ApiResponse>("/settings/environments/edit", body)).data;
}

export async function listEnvironments(body: {}) {
    return (await api.post<ApiResponse>("/settings/environments/list", body)).data;
}

export async function filterParticipants(body : FilterParticipants_RequestDTO) {
    return (await api.post<GroupFilteredParticipants_ResponseDTO>("/participant/filter", body)) 
}

export async function listCompetences(body: GroupIdOrPath_RequestDTO){
    return (await api.post<GroupCompetencesList_ResponseDTO>("/participant/competences", body)).data
}