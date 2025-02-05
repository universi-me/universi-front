import { LoaderFunctionArgs } from "react-router-dom";

import { UniversimeApi } from "@/services"
import { canI_API, fetchRoles, Permission } from "@/utils/roles/rolesUtils";

export type GroupPageLoaderResponse = {
    group: Group.DTO | undefined;
    subGroups: Group.DTO[];
    participants: Profile.DTO[];
    folders: Capacity.Folder.DTO[];
    posts: Feed.GroupPost[];
    jobs: Job.DTO[] | undefined;

    competenceTypes: Competence.Type[];

    loggedData: undefined | {
        profile: Profile.DTO;
        groups: Group.DTO[];
        links: Link.DTO[];
        isParticipant: boolean;
    };
};

export async function fetchGroupPageData(props: {groupPath: string | undefined}): Promise<GroupPageLoaderResponse> {
    if ( props.groupPath === undefined )
        return FAILED_TO_LOAD;

    const [ groupRes, profileRes ] = await Promise.all([
        UniversimeApi.Group.getFromPath( props.groupPath ),
        UniversimeApi.Profile.profile(),
        fetchRoles()
    ]);

    if ( !groupRes.isSuccess() || !profileRes.isSuccess() ) {
        return FAILED_TO_LOAD;
    }

    const group = groupRes.body;
    const profile = profileRes.body;

    if ( group.id === undefined )
        return FAILED_TO_LOAD;

    const [ canISubgroups, canIParticipants, canIFolders, canIFeed ] = await Promise.all([
        canI_API('GROUP',   Permission.READ, group),
        canI_API('PEOPLE',  Permission.READ, group),
        canI_API('CONTENT', Permission.READ, group),
        canI_API('FEED',    Permission.READ, group),
    ]);

    const [subgroupsRes, participantsRes, foldersRes, profileGroupsRes, profileLinksRes, groupPostsRes, jobsRes, competenceTypesRes] = await Promise.all([
        canISubgroups ? UniversimeApi.Group.subgroups(group.id)       : undefined,
        canIParticipants ? UniversimeApi.GroupParticipant.get(group.id) : undefined,
        canIFolders ? UniversimeApi.Group.folders(group.id)           : undefined,
        UniversimeApi.Profile.groups( profile.id ),
        UniversimeApi.Profile.links( profile.id ),
        canIFeed ? UniversimeApi.Feed.listGroup(group.id) : undefined,
        group.rootGroup ? UniversimeApi.Job.list({}) : undefined,
        UniversimeApi.CompetenceType.list()
    ]);

    return {
        group: group,
        folders: foldersRes?.data ?? [],
        participants: participantsRes?.data ?? [],
        subGroups: subgroupsRes?.data ?? [],
        posts: groupPostsRes?.data ?? [],
        jobs: jobsRes?.body,
        competenceTypes: competenceTypesRes.body ?? [],
        loggedData: {
            profile: profile,
            groups: profileGroupsRes.body ?? [],
            links: profileLinksRes.body ?? [],
            isParticipant: participantsRes?.body
            ?.find((p : any) => p.user.name === profile.user?.name) !== undefined,
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
