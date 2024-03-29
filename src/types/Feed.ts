import { type Profile } from "./Profile";

export type GroupPost = {
    postId: string;
    groupId: string;
    content : string;
    authorId : string;
    author : Profile;
}
