import { useContext, useEffect, useState } from "react";
import { Navigate, useLoaderData } from "react-router-dom";

import { GroupContext, GroupIntro, GroupTabRenderer, GroupTabs, fetchGroupPageData, type AvailableTabs, isTabAvailable, type GroupContextType, type GroupPageLoaderResponse, RefreshGroupOptions } from "@/pages/Group";
import { ProfileInfo } from "@/components/ProfileInfo/ProfileInfo";
import { AuthContext } from "@/contexts/Auth";
import "./Group.less";
import { ProfileClass } from "@/types/Profile";

export function GroupPage() {
    const page = useLoaderData() as GroupPageLoaderResponse;
    const authContext = useContext(AuthContext);
    const [currentTab, setCurrentTab] = useState<AvailableTabs>("feed");

    const [context, setContext] = useState(makeContext(page));
    useEffect(() => {
        setContext(makeContext(page));

        let tabNameSplit : string[] = window.location.hash.substring(1).split('/') ?? [];
        let tabName = tabNameSplit.length > 0 ? tabNameSplit[0] : null;
        let contentId = null;

        if(tabName) {
            if (isTabAvailable(tabName as string)) {
                setCurrentTab(tabName as AvailableTabs);
            }
            if(tabNameSplit.length > 1) {
                contentId = tabNameSplit[1];
                refreshGroupData({currentContentId: contentId});
            }
        } else {
            setCurrentTab("feed");
        }

    }, [page]);

    if (!page.loggedData || !page.group) {
        return (<Navigate to="/login" />);
    }

    return (
        <GroupContext.Provider value={context}>
        <div className="group-page-container">
            <ProfileInfo
                profile={context.loggedData.profile}
                links={context.loggedData.links}
                organization={authContext.organization}
                groups={context.loggedData.groups}
                id="group-page"
            >
                <div id="intro-tabs-wrapper">
                    <GroupIntro />
                    <div className="in-front-container">
                        <GroupTabs changeTab={changeTab} currentTab={currentTab} />
                        <GroupTabRenderer tab={currentTab} />
                    </div>
                </div>
            </ProfileInfo>
        </div>
        </GroupContext.Provider>
    );

    function changeTab(tab: AvailableTabs) {
        if (tab === "contents") {
            context.setCurrentContent(undefined);
        }


        setCurrentTab(tab);
    }

    async function refreshGroupData(options?: RefreshGroupOptions) {
        const data = await fetchGroupPageData({ groupPath: page.group?.path });
        const newContext = makeContext(data);

        if (options?.currentContentId) {
            newContext.currentContent = newContext.folders.find(c => c.id === options.currentContentId);
        }

        setContext(newContext);
        return newContext;
    }

    function makeContext(data: GroupPageLoaderResponse): NonNullable<GroupContextType> {
        // some values are using "!" even though they can be undefined

        return {
            folders: data.folders,
            posts: data.posts,
            group: data.group!,
            loggedData: {
                isParticipant: data.loggedData?.isParticipant!,
                profile: new ProfileClass(data.loggedData?.profile!),
                links: data.loggedData?.links ?? [],
                groups: data.loggedData?.groups ?? [],
            },
            participants: data.participants.map(ProfileClass.new),
            subgroups: data.subGroups,

            currentContent: undefined,
            setCurrentContent(c) {
                setContext({...this, currentContent: c});
            },

            editContent: undefined,
            setEditContent(c) {
                setContext({...this, editContent: c});
            },

            editMaterial: undefined,
            setEditMaterial(c) {
                setContext({...this, editMaterial: c});
            },

            editGroup: undefined,
            setEditGroup(c) {
                setContext({...this, editGroup: c});
            },

            editPost: undefined,
            setEditPost(c){
                setContext({...this, editPost: c})
            },

            assignFolder: undefined,
            setAssignFolder(c) {
                setContext({...this, assignFolder: c})
            },

            refreshData: refreshGroupData,
        };
    }
}
