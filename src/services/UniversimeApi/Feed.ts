import { ApiResponse } from "@/types/UniversimeApi";
import { api } from "./api";
import {GroupPost} from "@/types/Feed"
 
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
        const response = await api.delete<ApiResponse<string>>(`/feed/groups/${body.groupId}/posts/${body.postId}`);
        return response.data;
}
