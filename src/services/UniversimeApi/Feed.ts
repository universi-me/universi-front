import { ApiResponse } from "@/types/UniversimeApi";
import { createApiInstance } from "./api";
import {GroupPost, GroupPostComment, GroupPostReaction} from "@/types/Feed"

const api = createApiInstance( "/feed" )

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
    return (await api.get<GetGroupPosts_ResponseDTO>(`/groups/${body.groupId}/posts`)).data;
}

export async function createGroupPost(body: CreateGroupPost_RequestDTO): Promise<CreateGroupPost_ResponseDTO> {
    return (await api.post<CreateGroupPost_ResponseDTO>(`/groups/${body.groupId}/posts`, body)).data;
}

export async function editGroupPost(body : EditGroupPost_RequestDTO) : Promise<ApiResponse<string>> {
    return (await api.put<ApiResponse<string>>(`/groups/${body.groupId}/posts/${body.postId}`, body)).data;
}

export async function deleteGroupPost(body: DeleteGroupPost_RequestDTO): Promise<ApiResponse<string>> {
    const response = await api.delete<ApiResponse<string>>(`/groups/${body.groupId}/posts/${body.postId}`);
    return response.data;
}

export async function reactGroupPost(body: GroupPostReaction_RequestDTO): Promise<GroupPostReaction_ResponseDTO> {
    return (await api.post<GroupPostReaction_ResponseDTO>(`/posts/${body.groupPostId}/reactions`, body)).data;
}


export type GroupPostComment_RequestDTO = {
        groupPostId : string;
        content : string;
}

export type GroupPostCommentResponseDTO = ApiResponse<{comments: GroupPostComment}>;

export async function commentGroupPost(body: GroupPostComment_RequestDTO): Promise<GroupPostCommentResponseDTO> {
    return (await api.post<GroupPostCommentResponseDTO>(`/posts/${body.groupPostId}/comments`, body)).data;
}

export type GroupPostCommentEdit_RequestDTO = {
        commentId : string;
        content : string;
}

export async function editGroupPostComment(body : GroupPostCommentEdit_RequestDTO) : Promise<GroupPostCommentResponseDTO> {
    return (await api.post<GroupPostCommentResponseDTO>(`/comments/${body.commentId}/edit`, body)).data;
}

export type GroupPostCommentDelete_RequestDTO = {
        commentId : string;
}

export async function deleteGroupPostComment(body : GroupPostCommentDelete_RequestDTO) : Promise<ApiResponse<string>> {
    return (await api.delete<ApiResponse<string>>(`/comments/${body.commentId}`)).data;
}