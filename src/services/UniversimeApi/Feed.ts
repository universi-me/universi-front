import { ApiResponse } from "@/types/UniversimeApi";
import { api } from "./api";
import {GroupPost} from "@/types/Feed"
 
export type CreateGroupPost_RequestDTO = {
    content: string;
    groupId : string;
    authorId : string;
};

export type GetGroupPost_RequestDTO = {
    groupId : string;
}


export type CreateGroupPostResponseDTO = ApiResponse<GroupPost>; 
export type GetGroupPostsResponseDTO = ApiResponse<{posts: GroupPost[]}>; 

export async function getGroupPosts(body : GetGroupPost_RequestDTO): Promise<GetGroupPostsResponseDTO> {
        return (await api.get<GetGroupPostsResponseDTO>(`/feed/groups/${body.groupId}/posts`)).data;
}

export async function createGroupPost(body: CreateGroupPost_RequestDTO): Promise<CreateGroupPostResponseDTO> {
        return await (await api.post<CreateGroupPostResponseDTO>(`/feed/groups/${body.groupId}/posts`, body)).data;
}

export async function deleteGroupPost(groupId: string, postId: string): Promise<ApiResponse<string>> {
        const response = await api.delete<ApiResponse<string>>(`/api/feed/groups/${groupId}/posts/${postId}`);
        return response.data;
}
