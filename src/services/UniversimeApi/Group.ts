import type { Group, GroupType, GroupEmailFilter, GroupTheme } from "@/types/Group";
import type { Profile } from "@/types/Profile";
import type { ApiResponse } from "@/types/UniversimeApi";
import { api } from "./api";
import { Folder } from "@/types/Capacity";

export type GroupId_RequestDTO = {
    groupId: string;
};

export type GroupCreate_RequestDTO = {
    name:            string;
    description:     string;
    nickname:        string;
    groupType:       GroupType;
    imageUrl?:       string;
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
    canHaveSubgroup?: boolean;
    isPublic?:        boolean;
    canJoin?:         boolean;
};

export type GroupIdOrPath_RequestDTO = {
    groupId?:   string;
    groupPath?: string;
};

export type GroupEmailFilterAdd_RequestDTO = GroupIdOrPath_RequestDTO & {
    email:      string;
    isEnabled?: boolean;
    isRegex?:   boolean;
};

export type GroupEmailFilterEdit_RequestDTO = GroupIdOrPath_RequestDTO & {
    emailFilterId: string;
    email?:        string;
    isEnabled?:    boolean;
    isRegex?:      boolean;
};

export type GroupEmailFilterDelete_RequestDTO = GroupIdOrPath_RequestDTO & {
    emailFilterId: string;
};

export type GroupThemeEdit_RequestDTO = GroupIdOrPath_RequestDTO & {
    id:                     string;     
    primaryColor:           string;
    secondaryColor:         string;
    tertiaryColor:          string;
    backgroundColor:        string;
    cardBackgroundColor:    string;
    cardItemColor:          string;
    fontColorV1:            string;
    fontColorV2:            string;
    fontColorV3:            string;
    fontColorV4:            string;
    fontColorV5:            string;
    fontColorV6:            string;
    fontDisabledColor:      string;
    formsColor:             string;
    skills1Color:           string;
    waveColor:              string;
    buttonYellowHoverColor: string;
    buttonHoverColor:       string;
    alertColor:             string;
    successColor:           string;
    wrongInvalidColor:      string;
    rankColor:              string;
};


export type GroupGet_ResponseDTO =               ApiResponse<{ group: Group }>;
export type GroupCreate_ResponseDTO =            ApiResponse;
export type GroupUpdate_ResponseDTO =            ApiResponse;
export type GroupAvailableParents_ResponseDTO =  ApiResponse<{ groups: Group[] }>;
export type GroupSubgroups_ResponseDTO =         ApiResponse<{ subgroups: Group[] }>;
export type GroupParticipants_ResponseDTO =      ApiResponse<{ participants: Profile[] }>;
export type GroupJoin_ResponseDTO =              ApiResponse;
export type GroupExit_ResponseDTO =              ApiResponse;
export type GroupFolders_ResponseDTO =           ApiResponse<{ folders: Folder[] }>;
export type GroupEmailFilterAdd_ResponseDTO =    ApiResponse;
export type GroupEmailFilterEdit_ResponseDTO =   ApiResponse;
export type GroupEmailFilterDelete_ResponseDTO = ApiResponse;
export type GroupEmailFilterList_ResponseDTO =   ApiResponse<{ emailFilters: GroupEmailFilter[] }>;
export type GroupThemeEdit_ResponseDTO =         ApiResponse<{ theme: GroupTheme[] }>;

export async function get(body: GroupIdOrPath_RequestDTO) {
    return (await api.post<GroupGet_ResponseDTO>('/group/get', {
        groupId:   body.groupId,
        groupPath: body.groupPath,
    })).data;
}

export async function create(body: GroupCreate_RequestDTO) {
    return (await api.post<GroupCreate_ResponseDTO>("/group/create", {
        groupRoot:      body.isRootGroup,
        groupId:        body.parentGroupId,
        nickname:       body.nickname,
        name:           body.name,
        description:    body.description,
        imageUrl:       body.imageUrl,
        type:           body.groupType,
        canCreateGroup: body.canHaveSubgroup,
        publicGroup:    body.isPublic,
        canEnter:       body.canJoin,
    })).data;
}

export async function update(body: GroupUpdate_RequestDTO) {
    return (await api.post<GroupUpdate_ResponseDTO>("/group/update", {
        groupId:        body.groupId,
        groupPath:      body.groupPath,
        name:           body.name,
        description:    body.description,
        type:           body.groupType,
        imageUrl:       body.imageUrl,
        canCreateGroup: body.canHaveSubgroup,
        publicGroup:    body.isPublic,
        canEnter:       body.canJoin,
    })).data;
}

export async function availableParents() {
    return (await api.post<GroupAvailableParents_ResponseDTO>("/group/parents", {})).data;
}

export async function subgroups(body: GroupId_RequestDTO) {
    return (await api.post<GroupSubgroups_ResponseDTO>('/group/list', {
        groupId: body.groupId,
    })).data;
}

export async function participants(body: GroupId_RequestDTO) {
    return (await api.post<GroupParticipants_ResponseDTO>('/group/participant/list', {
        groupId: body.groupId,
    })).data;
}

export async function join(body: GroupId_RequestDTO) {
    return (await api.post<GroupJoin_ResponseDTO>('/group/participant/enter', {
        groupId: body.groupId,
    })).data;
}

export async function exit(body: GroupId_RequestDTO) {
    return (await api.post<GroupExit_ResponseDTO>('/group/participant/exit', {
        groupId: body.groupId,
    })).data;
}

export async function folders(body: GroupIdOrPath_RequestDTO) {
    return (await api.post<GroupFolders_ResponseDTO>("/group/folders", {
        groupId: body.groupId,
        groupPath: body.groupPath,
    })).data;
}

export async function addEmailFilter(body: GroupEmailFilterAdd_RequestDTO) {
    return (await api.post<GroupEmailFilterAdd_ResponseDTO>("/group/settings/email-filter/add", {
        groupId: body.groupId,
        groupPath: body.groupPath,
        email: body.email,
        enabled: body.isEnabled,
        isRegex: body.isRegex,
    })).data;
}

export async function editEmailFilter(body: GroupEmailFilterEdit_RequestDTO) {
    return (await api.post<GroupEmailFilterEdit_ResponseDTO>("/group/settings/email-filter/edit", {
        groupId: body.groupId,
        groupPath: body.groupPath,
        groupEmailFilterId: body.emailFilterId,
        email: body.email,
        enabled: body.isEnabled,
        isRegex: body.isRegex,
    })).data;
}

export async function deleteEmailFilter(body: GroupEmailFilterDelete_RequestDTO) {
    return (await api.post<GroupEmailFilterDelete_ResponseDTO>("/group/settings/email-filter/delete", {
        groupId: body.groupId,
        groupPath: body.groupPath,
        groupEmailFilterId: body.emailFilterId,
    })).data;
}

export async function listEmailFilter(body: GroupIdOrPath_RequestDTO) {
    return (await api.post<GroupEmailFilterList_ResponseDTO>("/group/settings/email-filter/list", {
        groupId: body.groupId,
        groupPath: body.groupPath,
    })).data;
}

export async function editTheme(body: GroupThemeEdit_RequestDTO) {
    return (await api.post<GroupThemeEdit_ResponseDTO>('/group/settings/theme/edit', {
        groupId:                    body.groupId,
        groupPath:                  body.groupPath,

        primary_Color:              body.primaryColor,
        secondary_Color:            body.secondaryColor,
        tertiary_Color:             body.tertiaryColor,
        background_Color:           body.backgroundColor,
        card_Background_Color:      body.cardBackgroundColor,
        card_Item_Color:            body.cardItemColor,
        font_Color_V1:              body.fontColorV1,
        font_Color_V2:              body.fontColorV2,
        font_Color_V3:              body.fontColorV3,
        font_Color_V4:              body.fontColorV4,
        font_Color_V5:              body.fontColorV5,
        font_Color_V6:              body.fontColorV6,
        font_Disabled_Color:        body.fontDisabledColor,
        forms_Color:                body.formsColor,
        skills_1_Color:             body.skills1Color,
        wave_Color:                 body.waveColor,
        button_Yellow_Hover_Color:  body.buttonYellowHoverColor,
        button_Hover_Color:         body.buttonHoverColor,
        alert_Color:                body.alertColor,
        success_Color:              body.successColor,
        wrong_Invalid_Color:        body.wrongInvalidColor,
        rank_Color:                 body.rankColor,
    })).data;
}
