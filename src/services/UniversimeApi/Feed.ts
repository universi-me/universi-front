import { ApiResponse } from "@/utils/apiUtils";
import { createApiInstance } from "./api";

const api = createApiInstance( "/feeds/groups" );


export function listGroup( groupId: string ) {
    return api.get<Feed.GroupPost[]>( `/${groupId}/posts` ).then( ApiResponse.new );
}

export function createPost( groupId: string, body: FeedCreatePost_RequestDTO ) {
    return api.post<Feed.Post>( `/${groupId}/posts`, body ).then( ApiResponse.new );
}

export function updatePost( groupId: string, postId: string, body: FeedCreatePost_RequestDTO ) {
    return api.patch<Feed.Post>( `/${groupId}/posts/${[postId]}`, body ).then( ApiResponse.new );
}

export function removePost( groupId: string, postId: string ) {
    return api.delete<undefined>( `/${groupId}/posts/${[postId]}` ).then( ApiResponse.new );
}

export type FeedCreatePost_RequestDTO = {
    authorId: string;
    content: string;
};
