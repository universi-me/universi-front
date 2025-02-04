import { LoaderFunctionArgs } from "react-router-dom";

import { UniversimeApi } from "@/services"
import type { Profile } from "@/types/Profile";
import type { Group } from "@/types/Group";
import type { Folder } from "@/types/Capacity";
import { Link } from "@/types/Link";
import { GroupPost } from "@/types/Feed";
import { canI_API, fetchRoles } from "@/utils/roles/rolesUtils";
import { Permission } from "@/types/Roles";
import { Job } from "@/types/Job";
import { CompetenceType } from "@/types/Competence";

export type GroupPageLoaderResponse = {
    group: Group | undefined;
    subGroups: Group[];
    participants: Profile[];
    folders: Folder[];
    posts: GroupPost[];
    jobs: Job[] | undefined;

    competenceTypes: CompetenceType[];

    loggedData: undefined | {
        profile: Profile;
        groups: Group[];
        links: Link[];
        isParticipant: boolean;
    };
};

export async function fetchGroupPageData(props: {groupPath: string | undefined}): Promise<GroupPageLoaderResponse> {
    const [groupRes, profileRes] = await Promise.all([
        UniversimeApi.Group.get({groupPath: props.groupPath}),
        UniversimeApi.Profile.profile(),
        fetchRoles()
    ]);
    if (!groupRes.success || !groupRes.body || !profileRes.success || !profileRes.body) {
        return FAILED_TO_LOAD;
    }
    
    const group = groupRes.body.group;
    const profile = profileRes.body.profile;
    
    const canISubgroups =    await canI_API('GROUP',   Permission.READ, group);
    const canIParticipants = await canI_API('PEOPLE',  Permission.READ, group);
    const canIFolders =      await canI_API('CONTENT', Permission.READ, group);
    const canIFeed =         await canI_API('FEED',    Permission.READ, group);

    const [subgroupsRes, participantsRes, foldersRes, profileGroupsRes, profileLinksRes, groupPostsRes, jobsRes, competenceTypesRes] = await Promise.all([
        canISubgroups ? UniversimeApi.Group.subgroups({groupId: group.id})       : undefined,
        canIParticipants ? UniversimeApi.Group.participants({groupId: group.id}) : undefined,
        canIFolders ? UniversimeApi.Group.folders({groupId: group.id})           : undefined,
        UniversimeApi.Profile.groups({profileId: profile.id}),
        UniversimeApi.Profile.links({profileId: profile.id}),
        canIFeed ? UniversimeApi.Feed.getGroupPosts({groupId: group.id}) : undefined,
        group.rootGroup ? UniversimeApi.Job.list({}) : undefined,
        UniversimeApi.CompetenceType.list()
    ]);

    return {
        group: group,
        folders: foldersRes?.success ? foldersRes.body.folders : [],
        participants: participantsRes?.success ? participantsRes.body.participants : [],
        subGroups: subgroupsRes?.success ? subgroupsRes.body.subgroups : [],
        posts: groupPostsRes?.success ? groupPostsRes.body.posts : [],
        jobs: jobsRes?.body?.list,
        competenceTypes: competenceTypesRes.body?.list ?? [],
        loggedData: {
            profile: profile,
            groups: profileGroupsRes.body?.groups ?? [],
            links: profileLinksRes.body?.links ?? [],
            isParticipant: participantsRes?.body?.participants
            .find((p : any) => p.user.name === profile.user?.name) !== undefined,
        }
    };
}

export function GroupPageLoader(args: LoaderFunctionArgs) {
    const groupPath = args.params["*"];
    return fetchGroupPageData({groupPath});
}

const FAILED_TO_LOAD: GroupPageLoaderResponse = {
    group: undefined,
    loggedData: undefined,
    folders: [],
    participants: [],
    subGroups: [],
    posts: [],
    jobs: [],
    competenceTypes: [],
};
