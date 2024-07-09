import { ApiResponse } from "@/types/UniversimeApi";
import { api } from "./api";
import {GroupPost, GroupPostComment, GroupPostReaction} from "@/types/Feed"
 
export type CreateGroupPost_RequestDTO = {
    content  : string;
    groupId  : string;
    authorId : string;
};

export type GetGroupPost_RequestDTO = {
    groupId : string;
}


export type DeleteGroupPost_RequestDTO = {
        postId  : string;
        groupId : string;
}

export type EditGroupPost_RequestDTO = {
        content : string;
        postId  : string;
        groupId : string;
}

export type CreateGroupPostResponseDTO = ApiResponse<GroupPost>; 
export type GetGroupPostsResponseDTO = ApiResponse<{posts: GroupPost[]}>; 

export async function getGroupPosts(body : GetGroupPost_RequestDTO): Promise<GetGroupPostsResponseDTO> {
        return (await api.get<GetGroupPostsResponseDTO>(`/feed/groups/${body.groupId}/posts`)).data;
}

export async function createGroupPost(body: CreateGroupPost_RequestDTO): Promise<CreateGroupPostResponseDTO> {
        return (await api.post<CreateGroupPostResponseDTO>(`/feed/groups/${body.groupId}/posts`, body)).data;
}

export async function editGroupPost(body : EditGroupPost_RequestDTO) : Promise<ApiResponse<string>> {
        return (await api.put<ApiResponse<string>>(`/feed/groups/${body.groupId}/posts/${body.postId}`, body)).data;
}

export async function deleteGroupPost(body: DeleteGroupPost_RequestDTO): Promise<ApiResponse<string>> {
        const response = await api.delete<ApiResponse<string>>(`/feed/posts/${body.postId}`);
        return response.data;
}


export type GroupPostReaction_RequestDTO = {
        groupPostId : string;
        reaction : string;
}

export type GroupPostReactionResponseDTO = ApiResponse<{reactions: GroupPostReaction}>;

export async function reactGroupPost(body: GroupPostReaction_RequestDTO): Promise<GroupPostReactionResponseDTO> {
    return (await api.post<GroupPostReactionResponseDTO>(`/feed/posts/${body.groupPostId}/reactions`, body)).data;
}


export type GroupPostComment_RequestDTO = {
        groupPostId : string;
        content : string;
}

export type GroupPostCommentResponseDTO = ApiResponse<{comments: GroupPostComment}>;

export async function commentGroupPost(body: GroupPostComment_RequestDTO): Promise<GroupPostCommentResponseDTO> {
    return (await api.post<GroupPostCommentResponseDTO>(`/feed/posts/${body.groupPostId}/comments`, body)).data;
}

export type GroupPostCommentEdit_RequestDTO = {
        commentId : string;
        content : string;
}

export async function editGroupPostComment(body : GroupPostCommentEdit_RequestDTO) : Promise<GroupPostCommentResponseDTO> {
    return (await api.post<GroupPostCommentResponseDTO>(`/feed/comments/${body.commentId}/edit`, body)).data;
}

export type GroupPostCommentDelete_RequestDTO = {
        commentId : string;
}

export async function deleteGroupPostComment(body : GroupPostCommentDelete_RequestDTO) : Promise<ApiResponse<string>> {
    return (await api.delete<ApiResponse<string>>(`/feed/comments/${body.commentId}`)).data;
}