import { useEffect, useMemo, useState } from "react";
import { Navigate, useLoaderData } from "react-router-dom";

import { GroupIntro, GroupContext, GroupContextType, GroupPageLoaderResponse, GroupTabs, GroupTabRenderer, AvailableTabs } from "@/pages/Group";
import { ProfileBio, ProfileGroups } from "@/components/ProfileInfo";
import "./Group.less";

export function GroupPage() {
    const page = useLoaderData() as GroupPageLoaderResponse;
    const [currentTab, setCurrentTab] = useState<AvailableTabs>("contents");
    const context = useMemo<GroupContextType>(() => {
        // some values are using "!" even though they can be undefined
        // they are validated later

        return {
            folders: page.folders,
            group: page.group!,
            isParticipant: page.loggedData?.isParticipant!,
            participants: page.participants,
            subgroups: page.subGroups,
        };
    }, [page]);

    useEffect(() => {
        setCurrentTab("contents");
    }, [page.group?.path]);

    if (!page.loggedData || !page.group) {
        return (<Navigate to="/login" />);
    }

    return (
        <GroupContext.Provider value={context}>
        <div id="group-page">
            <div>
                <ProfileBio profile={page.loggedData.profile} />
                <ProfileGroups groups={page.loggedData.groups} />
            </div>
            <div id="intro-tabs-wrapper">
                <GroupIntro />
                <GroupTabs changeTab={setCurrentTab} currentTab={currentTab} />
                <GroupTabRenderer tab={currentTab} />
            </div>
        </div>
        </GroupContext.Provider>
    );
}
