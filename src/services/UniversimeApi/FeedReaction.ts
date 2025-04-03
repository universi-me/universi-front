import { ApiResponse } from "@/utils/apiUtils";
import { createApiInstance } from "./api";

const api = createApiInstance( "/feeds" );


export function get( postId: string ) {
    return api.get<Feed.Reaction[]>( `/posts/${postId}/reactions` ).then( ApiResponse.new );
}

export function set( postId: string, body: FeedReactionSet_RequestDTO ) {
    return api.patch<Feed.Reaction>( `/posts/${postId}/reactions`, body ).then( ApiResponse.new );
}

export type FeedReactionSet_RequestDTO = {
    reaction: string;
};
