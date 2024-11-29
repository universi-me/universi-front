import { type Profile } from "./Profile";

export type GroupPost = {
    reactions: GroupPostReaction[];
    comments: GroupPostComment[];
    postId: string;
    groupId: string;
    content : string;
    authorId : string;
    author : Profile;
}

export type GroupPostReaction = {
    reaction: string;
    groupPostId: string;
    authorId: string;
}

export type GroupPostComment = GroupPost & {
    id: string;
    groupPostId: string;
    content : string;
    author : Profile;
    authorId : string;
}