import { createContext } from "react";
import { Group } from "@/types/Group";
import { type ProfileClass } from "@/types/Profile";
import type { Content, Folder } from "@/types/Capacity";
import { Link } from "@/types/Link";
import { GroupPost } from "@/types/Feed";

export type GroupContextType = null | {
    group:         Group;
    subgroups:     Group[];
    participants:  ProfileClass[];
    folders:       Folder[];
    posts:         GroupPost[];

    currentContent: Folder | undefined;
    setCurrentContent(content: Folder | undefined): any;

    /**
     * The content being edited/created.
     *
     * If `null`, should handle creation of a content. If has a value, should handle
     * content edit. If `undefined`, no content is being edited nor created.
     */
    editContent: Folder | null | undefined;
    setEditContent(content: Folder | null | undefined): any;

    /**
     * The material being edited/created.
     *
     * If `null`, should handle creation of a material. If has a value, should handle
     * material edit. If `undefined`, no material is being edited nor created.
     */
    editMaterial: Content | null | undefined;
    setEditMaterial(material: Content | null | undefined): any;

    /**
     * The group being edited/created.
     *
     * If `null`, should handle creation of a group. If has a value, should handle
     * group edit. If `undefined`, no group is being edited nor created.
     */
    editGroup: Group | null | undefined;
    setEditGroup(group: Group | null | undefined) : any;

    /**
     * The post being edited/created.
     *
     * If `null`, should handle creation of a post. If has a value, should handle
     * post edit. If `undefined`, no post is being edited nor created.
     */
    editPost: GroupPost | null | undefined;
    setEditPost(post: GroupPost | null | undefined) : any;

    loggedData: {
        isParticipant: boolean;
        profile:       ProfileClass;
        links:         Link[];
        groups:        Group[];
    };

    refreshData: (options?: RefreshGroupOptions) => Promise<NonNullable<GroupContextType>>;
};

export type RefreshGroupOptions = {
    currentContentId?: string;
}

export const GroupContext = createContext<GroupContextType>(null);
