import { useContext, useEffect, useState } from "react";
import { Navigate, useLoaderData } from "react-router-dom";

import { GroupContext, GroupIntro, GroupTabRenderer, GroupTabs, fetchGroupPageData, type AvailableTabs, type GroupContextType, type GroupPageLoaderResponse } from "@/pages/Group";
import { ProfileBio, ProfileGroups } from "@/components/ProfileInfo";
import { AuthContext } from "@/contexts/Auth";
import "./Group.less";

export function GroupPage() {
    const page = useLoaderData() as GroupPageLoaderResponse;
    const authContext = useContext(AuthContext);
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
        <div className="group-page-container">
            <div id="group-page">
                <div>
                    <ProfileBio profile={context.loggedData.profile} links={context.loggedData.links} organization={authContext.organization} />
                    <ProfileGroups groups={context.loggedData.groups} />
                </div>
                <div id="intro-tabs-wrapper">
                    <GroupIntro />
                    <div className="in-front-container">
                        <GroupTabs changeTab={changeTab} currentTab={currentTab} />
                        <GroupTabRenderer tab={currentTab} />
                    </div>
                </div>
            </div>
        </div>
        </GroupContext.Provider>
    );

    function changeTab(tab: AvailableTabs) {
        if (tab === "contents") {
            context.setCurrentContent(undefined);
        }


        setCurrentTab(tab);
    }

    async function refreshGroupData() {
        const data = await fetchGroupPageData({ groupPath: page.group?.path });
        const newContext = makeContext(data);
        setContext(newContext);
        return newContext;
    }

    function makeContext(data: GroupPageLoaderResponse): NonNullable<GroupContextType> {
        // some values are using "!" even though they can be undefined

        return {
            folders: data.folders,
            group: data.group!,
            loggedData: {
                isParticipant: data.loggedData?.isParticipant!,
                profile: data.loggedData?.profile!,
                links: data.loggedData?.links ?? [],
                groups: data.loggedData?.groups ?? [],
            },
            participants: data.participants,
            subgroups: data.subGroups,

            currentContent: undefined,
            setCurrentContent(c) {
                setContext({...this, currentContent: c});
            },

            refreshData: refreshGroupData,
        };
    }
}
