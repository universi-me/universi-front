import { useContext, useEffect, useRef, useState } from "react";
import { Navigate, useLoaderData } from "react-router-dom";

import { GroupContext, GroupIntro, GroupTabRenderer, GroupTabs, fetchGroupPageData, type AvailableTabs, asTabAvailable, type GroupContextType, type GroupPageLoaderResponse, RefreshGroupOptions } from "@/pages/Group";
import ManageGroup from "@/components/ManageGroup";
import { ProfileInfo } from "@/components/ProfileInfo/ProfileInfo";
import { AuthContext } from "@/contexts/Auth";
import "./Group.less";
import { ProfileClass } from "@/types/Profile";
import GroupConfigModal from './GroupConfig/GroupConfigModal';

export function GroupPage() {
    const page = useLoaderData() as GroupPageLoaderResponse;
    const authContext = useContext(AuthContext);

    const tabSave = useRef<AvailableTabs>();
    const [context, setContext] = useState(makeContext(page));

    useEffect(() => {
        const newContext = makeContext(page);
        setContext(newContext);

        let tabNameSplit : string[] = window.location.hash.substring(1).split('/') ?? [];
        let tabName = tabNameSplit.length > 0 ? tabNameSplit[0] : null;
        let useDefaultTab = true;

        if(tabName) {
            const tab = asTabAvailable(tabName);

            if (tab) {
                useDefaultTab = false;
                newContext.setCurrentTab(tabName as AvailableTabs);
            }

            if(tab === "contents" && tabNameSplit.length > 1) {
                useDefaultTab = false;
                newContext
                    .refreshData({ currentContentId: tabNameSplit[1] })
                    .then( c => c.setCurrentTab(tab));
            }
        }

        if (useDefaultTab) {
            newContext.setCurrentTab("feed");
        }

    }, [page]);

    if (!page.loggedData || !page.group) {
        return (<Navigate to="/login" />);
    }

    return (
        <GroupContext.Provider value={context}>
        {
            context.groupConfigModalOpen && <GroupConfigModal />
        }
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
                        <GroupTabs />
                        <GroupTabRenderer />
                    </div>
                </div>
            </ProfileInfo>
        </div>

        { context.editGroup !== undefined &&
            <ManageGroup group={context.editGroup} parentGroup={context.group}
                callback={ async res => {
                    let c = context;
                    if ( res?.isSuccess() )
                        c = await context.refreshData();

                    c.setEditGroup( undefined );
                } }
            />
        }
        </GroupContext.Provider>
    );

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
            jobs: data.jobs,
            competenceTypes: data.competenceTypes,
            activities: data.activities,
            group: data.group!,
            loggedData: {
                isParticipant: data.loggedData?.isParticipant!,
                profile: new ProfileClass(data.loggedData?.profile!),
                links: data.loggedData?.links ?? [],
                groups: data.loggedData?.groups.sort((g1, g2) => {
                    if (g1.rootGroup && !g2.rootGroup) {
                        return -1; 
                    } else if (!g1.rootGroup && g2.rootGroup) {
                        return 1; 
                    } else {
                        return g1.name.localeCompare(g2.name);
                    }
                }) ?? [],
            },
            participants: data.participants.map(ProfileClass.new),
            subgroups: data.subGroups,

            groupConfigModalOpen: false,
            setGroupConfigModalOpen(open) {
                setContext({...this, groupConfigModalOpen: open});
            },

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

            editJob: undefined,
            setEditJob(j) {
                setContext({...this, editJob: j})
            },

            currentTab: tabSave.current,
            setCurrentTab(t) {
                setContext({ ...this, currentTab: t });
                tabSave.current = t;
            },

            refreshData: refreshGroupData,
        };
    }
}
