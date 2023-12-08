import { Profile } from "./Profile";

export type GroupPost = {
    id: string;
    groupId: string;
    content : string;
    authorId : string;
    author : Profile | undefined;
}