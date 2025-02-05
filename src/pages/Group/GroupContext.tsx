import { createContext } from "react";
import { AvailableTabs } from "./GroupTabs";
import { type ProfileClass } from "@/types/Profile";

export type GroupContextType = null | {
    group:         Group.DTO;
    subgroups:     Group.DTO[];
    participants:  ProfileClass[];
    folders:       Capacity.Folder.DTO[];
    posts:         Feed.GroupPost[];
    jobs:          Job.DTO[] | undefined;

    competenceTypes: Competence.Type[];

    currentContent: Capacity.Folder.DTO | undefined;
    setCurrentContent(content: Capacity.Folder.DTO | undefined): any;

    /**
     * The modal to configure the group.
     */
    groupConfigModalOpen: boolean;
    setGroupConfigModalOpen(open: boolean): any;

    /**
     * The content being edited/created.
     *
     * If `null`, should handle creation of a content. If has a value, should handle
     * content edit. If `undefined`, no content is being edited nor created.
     */
    editContent: Capacity.Folder.DTO | null | undefined;
    setEditContent(content: Capacity.Folder.DTO | null | undefined): any;

    /**
     * The material being edited/created.
     *
     * If `null`, should handle creation of a material. If has a value, should handle
     * material edit. If `undefined`, no material is being edited nor created.
     */
    editMaterial: Capacity.Content.DTO | null | undefined;
    setEditMaterial(material: Capacity.Content.DTO | null | undefined): any;

    /**
     * The group being edited/created.
     *
     * If `null`, should handle creation of a group. If has a value, should handle
     * group edit. If `undefined`, no group is being edited nor created.
     */
    editGroup: Group.DTO | null | undefined;
    setEditGroup(group: Group.DTO | null | undefined) : any;

    /**
     * The post being edited/created.
     *
     * If `null`, should handle creation of a post. If has a value, should handle
     * post edit. If `undefined`, no post is being edited nor created.
     */
    editPost: Feed.GroupPost | null | undefined;
    setEditPost(post: Feed.GroupPost | null | undefined) : any;

    /**
     * The Folder being assigned to someone
     */
    assignFolder: Capacity.Folder.DTO | undefined;
    setAssignFolder(group: Capacity.Folder.DTO | undefined) : any;

    /**
     * The job being edited/created.
     *
     * If `null`, should handle creation of a job. If has a value, should handle
     * job edit. If `undefined`, no job is being edited nor created.
     */
    editJob: Job.DTO | null | undefined;
    setEditJob(job: Job.DTO | null | undefined) : any;

    loggedData: {
        isParticipant: boolean;
        profile:       ProfileClass;
        links:         Link.DTO[];
        groups:        Group.DTO[];
    };

    currentTab: AvailableTabs | undefined;
    setCurrentTab(tab: AvailableTabs): any;

    refreshData: (options?: RefreshGroupOptions) => Promise<NonNullable<GroupContextType>>;
};

export type RefreshGroupOptions = {
    currentContentId?: string;
}

export const GroupContext = createContext<GroupContextType>(null);
