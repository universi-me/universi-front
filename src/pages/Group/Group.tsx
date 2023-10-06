import { useMemo, useState } from "react";
import { Navigate, useLoaderData } from "react-router-dom";

import { GroupIntro, GroupContext, GroupContextType, GroupPageLoaderResponse, GroupTabs, GroupTabDefinition, GroupTabRenderer, AvailableTabs } from "@/pages/Group";
import { ProfileBio, ProfileGroups } from "@/components/ProfileInfo";
import "./Group.css";

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
    }, []);

    if (!page.loggedData || !page.group) {
        return (<Navigate to="/login" />);
    }

    return (
        <GroupContext.Provider value={context}>
        <div id="group-page">
            <div className="content">
                <div className="group-infos">
                    <div className="left-side">
                        <ProfileBio profile={page.loggedData.profile} />
                        <ProfileGroups groups={page.loggedData.groups} />
                    </div>

                    <div className="right-side">
                        <GroupIntro />
                        <GroupTabs tabs={TABS} changeTab={setCurrentTab} />
                        <GroupTabRenderer tab={currentTab} />
                    </div>
                </div>
            </div>
        </div>
        </GroupContext.Provider>
    );
}

const TABS: GroupTabDefinition[] = [
    {
        name: 'Conteúdos',
        value: "contents"
    },
    {
        name: "Arquivos",
        value: "files"
    },
    {
        name: "Grupos",
        value: "groups"
    },
    {
        name: "Pessoas",
        value: "people"
    },
];
