import { ApiResponse } from "@/utils/apiUtils";
import { createApiInstance } from "./api";

const api = createApiInstance( "/feeds" );


export function create( postId: string, body: FeedCommentCreate_RequestDTO ) {
    return api.post<Feed.Comment>( `/posts/${postId}/comments`, body ).then( ApiResponse.new );
}

export function update( commentId: string, body: FeedCommentCreate_RequestDTO ) {
    return api.patch<Feed.Comment>( `/comments/${commentId}`, body ).then( ApiResponse.new );
}

export function remove( commentId: string ) {
    return api.delete<undefined>( `/comments/${commentId}` ).then( ApiResponse.new );
}

export type FeedCommentCreate_RequestDTO = {
    content: string;
};
