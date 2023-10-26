import { useEffect, useMemo, useState } from "react";
import { Navigate, useLoaderData } from "react-router-dom";

import { GroupContext, GroupIntro, GroupTabRenderer, GroupTabs, fetchGroupPageData, type AvailableTabs, type GroupContextType, type GroupPageLoaderResponse } from "@/pages/Group";
import { ProfileBio, ProfileGroups } from "@/components/ProfileInfo";
import "./Group.less";

export function GroupPage() {
    const page = useLoaderData() as GroupPageLoaderResponse;
    const [currentTab, setCurrentTab] = useState<AvailableTabs>("contents");

    const [context, setContext] = useState(makeContext(page));
    useEffect(() => {
        setContext(makeContext(page));
        setCurrentTab("contents");
    }, [page]);

    if (!page.loggedData || !page.group) {
        return (<Navigate to="/login" />);
    }

    return (
        <GroupContext.Provider value={context}>
        <div id="group-page">
            <div>
                <ProfileBio profile={context.loggedData.profile} />
                <ProfileGroups groups={context.loggedData.groups} />
            </div>
            <div id="intro-tabs-wrapper">
                <GroupIntro />
                <GroupTabs changeTab={setCurrentTab} currentTab={currentTab} />
                <GroupTabRenderer tab={currentTab} />
            </div>
        </div>
        </GroupContext.Provider>
    );

    async function refreshGroupData() {
        const data = await fetchGroupPageData({ groupPath: page.group?.path });
        setContext(makeContext(data));
    }

    function makeContext(data: GroupPageLoaderResponse): NonNullable<GroupContextType> {
        // some values are using "!" even though they can be undefined

        return {
            folders: data.folders,
            group: data.group!,
            loggedData: {
                isParticipant: data.loggedData?.isParticipant!,
                profile: data.loggedData?.profile!,
                groups: data.loggedData?.groups!,
            },
            participants: data.participants,
            subgroups: data.subGroups,

            refreshData: refreshGroupData,
        };
    }
}
