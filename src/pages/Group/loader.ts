import { LoaderFunctionArgs } from "react-router-dom";

import UniversimeApi from "@/services/UniversimeApi";
import type { Profile } from "@/types/Profile";
import type { Group } from "@/types/Group";
import type { Folder } from "@/types/Capacity";
import { Link } from "@/types/Link";

export type GroupPageLoaderResponse = {
    group: Group | undefined;
    subGroups: Group[];
    participants: Profile[];
    folders: Folder[];

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
    ]);
    if (!groupRes.success || !groupRes.body || !profileRes.success || !profileRes.body) {
        return FAILED_TO_LOAD;
    }
    
    const group = groupRes.body.group;
    const profile = profileRes.body.profile;
    
    const [subgroupsRes, participantsRes, foldersRes, profileGroupsRes, profileLinksRes] = await Promise.all([
        UniversimeApi.Group.subgroups({groupId: group.id}),
        UniversimeApi.Group.participants({groupId: group.id}),
        UniversimeApi.Group.folders({groupId: group.id}),
        UniversimeApi.Profile.groups({profileId: profile.id}),
        UniversimeApi.Profile.links({profileId: profile.id}),
    ]);
    
    return {
        group: group,
        folders: foldersRes.body?.folders ?? [],
        participants: participantsRes.body?.participants ?? [],
        subGroups: subgroupsRes.body?.subgroups ?? [],
        loggedData: {
            profile: profile,
            groups: profileGroupsRes.body?.groups ?? [],
            links: profileLinksRes.body?.links ?? [],
            isParticipant: participantsRes.body?.participants
            .find(p => p.user.name === profile.user?.name) !== undefined,
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
    subGroups: []
};
