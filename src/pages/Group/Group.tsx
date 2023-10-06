import { useMemo } from "react";
import { Navigate, useLoaderData } from "react-router-dom";

import { GroupIntro, GroupContext, GroupContextType, GroupContents, GroupPageLoaderResponse } from "@/pages/Group";
import { ProfileBio, ProfileGroups } from "@/components/ProfileInfo";
import "./Group.css";

export function GroupPage() {
    const page = useLoaderData() as GroupPageLoaderResponse;
    const context = useMemo<GroupContextType>(() => {
        // some values are using "!" even though they can be null
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
                        <GroupContents />
                    </div>
                </div>
            </div>
        </div>
        </GroupContext.Provider>
    );
}
