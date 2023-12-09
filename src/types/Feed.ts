import { ProfileClass } from "./Profile";

export type GroupPost = {
    id: string;
    groupId: string;
    content : string;
    authorId : string;
    author : ProfileClass | undefined;
}