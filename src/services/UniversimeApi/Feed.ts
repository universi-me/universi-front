import { ApiResponse } from "@/types/UniversimeApi";
import { api } from "./api";
import {GroupPost, GroupPostReaction} from "@/types/Feed"
 
export type CreateGroupPost_RequestDTO = {
    content  : string;
    groupId  : string;
    authorId : string;
};

export type GetGroupPost_RequestDTO = {
    groupId : string;
};

export type DeleteGroupPost_RequestDTO = {
        postId  : string;
        groupId : string;
};

export type EditGroupPost_RequestDTO = {
        content : string;
        postId  : string;
        groupId : string;
};

export type GroupPostReaction_RequestDTO = {
    groupPostId : string;
    reaction : string;
};

export type CreateGroupPost_ResponseDTO = ApiResponse<GroupPost>; 
export type GetGroupPosts_ResponseDTO = ApiResponse<{posts: GroupPost[]}>; 
export type GroupPostReaction_ResponseDTO = ApiResponse<{reactions: GroupPostReaction}>;

export async function getGroupPosts(body : GetGroupPost_RequestDTO): Promise<GetGroupPosts_ResponseDTO> {
    return (await api.get<GetGroupPosts_ResponseDTO>(`/feed/groups/${body.groupId}/posts`)).data;
}

export async function createGroupPost(body: CreateGroupPost_RequestDTO): Promise<CreateGroupPost_ResponseDTO> {
    return (await api.post<CreateGroupPost_ResponseDTO>(`/feed/groups/${body.groupId}/posts`, body)).data;
}

export async function editGroupPost(body : EditGroupPost_RequestDTO) : Promise<ApiResponse<string>> {
    return (await api.put<ApiResponse<string>>(`/feed/groups/${body.groupId}/posts/${body.postId}`, body)).data;
}

export async function deleteGroupPost(body: DeleteGroupPost_RequestDTO): Promise<ApiResponse<string>> {
    const response = await api.delete<ApiResponse<string>>(`/feed/groups/${body.groupId}/posts/${body.postId}`);
    return response.data;
}

export async function reactGroupPost(body: GroupPostReaction_RequestDTO): Promise<GroupPostReaction_ResponseDTO> {
    return (await api.post<GroupPostReaction_ResponseDTO>(`/feed/posts/${body.groupPostId}/reactions`, body)).data;
}
