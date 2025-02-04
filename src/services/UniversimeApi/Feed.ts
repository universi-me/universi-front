import { ApiResponse } from "@/utils/apiUtils";
import { createApiInstance } from "./api";

const api = createApiInstance( "/feeds/groups" );


export function listGroup( groupId: string ) {
    return api.get<Feed.GroupGet>( `/${groupId}/posts` ).then( ApiResponse.new );
}

export function createPost( groupId: string, body: FeedCreatePost_RequestDTO ) {
    return api.post<Feed.GroupGet>( `/${groupId}/posts`, body ).then( ApiResponse.new );
}

export function updatePost( groupId: string, postId: string, body: FeedCreatePost_RequestDTO ) {
    return api.patch<Feed.GroupGet>( `/${groupId}/posts/${[postId]}`, body ).then( ApiResponse.new );
}

export function removePost( groupId: string, postId: string ) {
    return api.delete<Feed.GroupGet>( `/${groupId}/posts/${[postId]}` ).then( ApiResponse.new );
}

export type FeedCreatePost_RequestDTO = {
    authorId: string;
    content: string;
};
