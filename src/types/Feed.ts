import { type Profile } from "./Profile";

export type GroupPost = {
    reactions: GroupPostReaction[];
    postId: string;
    groupId: string;
    content : string;
    authorId : string;
    author : Profile;
}

export type GroupPostReaction = {
    reaction: string;
    groupId: string;
    groupPostId: string;
    authorId: string;
}