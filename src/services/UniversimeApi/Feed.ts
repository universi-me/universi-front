import { ApiResponse } from "@/types/UniversimeApi";
import { api } from "./api";
import {GroupPost} from "@/types/Feed"
 
export type CreateGroupPostRequestDTO = {
    content: string;
};


export type CreateGroupPostResponseDTO = ApiResponse<GroupPost>; 
export type GetGroupPostsResponseDTO = ApiResponse<GroupPost[]>; 

export async function getGroupPosts(groupId: string): Promise<GetGroupPostsResponseDTO> {
    try {
        const response = await api.get<GetGroupPostsResponseDTO>(`/api/feed/groups/${groupId}/posts`);
        return response.data;
    } catch (error) {
        console.error("Erro ao obter posts do grupo:", error);
        throw error;
    }
}

export async function createGroupPost(groupId: string, body: CreateGroupPostRequestDTO): Promise<CreateGroupPostResponseDTO> {
    try {
        const response = await api.post<CreateGroupPostResponseDTO>(`/api/feed/groups/${groupId}/posts`, body);
        return response.data;
    } catch (error) {
        console.error("Erro ao criar post no grupo:", error);
        throw error;
    }
}

export async function deleteGroupPost(groupId: string, postId: string): Promise<ApiResponse<string>> {
    try {
        const response = await api.delete<ApiResponse<string>>(`/api/feed/groups/${groupId}/posts/${postId}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao excluir post do grupo:", error);
        throw error;
    }
}
