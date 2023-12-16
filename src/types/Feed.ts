import { ProfileClass } from "./Profile";

export type GroupPost = {
    postId: string;
    groupId: string;
    content : string;
    authorId : string;
    author : ProfileClass | undefined;
}