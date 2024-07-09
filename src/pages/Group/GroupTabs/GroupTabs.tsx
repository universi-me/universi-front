import { useContext, type ReactElement } from "react";
import { GroupContents, GroupContext, GroupGroups, GroupPeople, GroupFeed, GroupContextType, GroupJobs } from "@/pages/Group";
import "./GroupTabs.less";
import UniversimeApi from "@/services/UniversimeApi";
import { AuthContext } from "@/contexts/Auth";
import { GroupSubmenu } from "../GroupSubmenu/GroupSubmenu";
import { GroupCompetences } from "./GroupCompetences/GroupCompetences";
import useCanI, { CanI_SyncFunction } from "@/hooks/useCanI";
import { Permission } from "@/types/Roles";

export type AvailableTabs = "feed" | "contents" | "groups" | "people" | "competences" | "jobs";

export type GroupTabDefinition = {
    name: string,
    value: AvailableTabs,
    renderer(): ReactElement | null,
    condition?(context: NonNullable<GroupContextType>, canI: CanI_SyncFunction): boolean;
};

export type GroupTabsProps = {
    currentTab: AvailableTabs;
    changeTab: (tab: AvailableTabs) => any;
};

export  function GroupTabs(props: GroupTabsProps){
    const context = useContext(GroupContext);
    const auth = useContext(AuthContext);
    const canI = useCanI();

    async function join(){
        if(!context?.group.canEnter || context.group.id == null)
            return;

        const resData = await UniversimeApi.Group.join({groupId: context.group.id});
        await Promise.all([
            context.refreshData(),
            auth.updateLoggedUser(),
        ])
    }

    if (!context)
        return <></>;

    const joined = context.loggedData.isParticipant;
    const renderJoinOrLeave = (joined || context.group.canEnter);

    return (
        <nav id="group-tabs"> 
        {
            TABS.map(t => {
                const isCurrentTab = t.value === props.currentTab;
                const render = t.condition?.(context, canI) ?? true;

                return render && <button className={`group-tab-button`} value={t.value} key={t.value} onClick={() => { window.location.hash = t.value; props.changeTab(t.value); }} data-current-tab={isCurrentTab ? "" : undefined}>
                    {t.name}
                </button>;
            })
        }


        {   !renderJoinOrLeave ? null :
                (joined && <GroupSubmenu />) ||
                <button className="group-tab-participacao" onClick={join}>Participar</button>
        }

         </nav>
    );
}

export function GroupTabRenderer({tab}: { tab: AvailableTabs }) {
    const renderedTab = TABS.find(t => t.value === tab);

    return renderedTab
        ? <renderedTab.renderer />
        : null;
}

export function isTabAvailable(tab: string): boolean {
    return TABS.find(t => t.value === tab) !== undefined;
}

export const EMPTY_LIST_CLASS = "empty-text";

const TABS: GroupTabDefinition[] = [
    {
        name: 'Publicações',
        value: 'feed',
        renderer: GroupFeed,
        condition(context, canI) {
            return canI("FEED", Permission.READ, context.group) && (
                context.posts.length > 0
                || canI("FEED", Permission.READ_WRITE, context.group)
            );
        },
    },
    {
        name: 'Conteúdos',
        value: "contents",
        renderer: GroupContents,
        condition(context, canI) {
            return canI("CONTENT", Permission.READ, context.group) && (
                context.folders.length > 0
                || canI("CONTENT", Permission.READ_WRITE, context.group)
            );
        },
    },
    {
        name: "Grupos",
        value: "groups",
        renderer: GroupGroups,
        condition(context, canI) {
            return canI("GROUP", Permission.READ, context.group) && (
                context.subgroups.length > 0
                || canI("GROUP", Permission.READ_WRITE, context.group)
            );
        },
    },
    {
        name: "Pessoas",
        value: "people",
        renderer: GroupPeople,
        condition(context, canI) {
            return canI("PEOPLE", Permission.READ, context.group);
        },
    },
    {
        name: "Competências",
        value: "competences",
        renderer: GroupCompetences,
        condition(context, canI) {
            return canI("COMPETENCE", Permission.READ, context.group);
        },
    },
    {
        name: "Vagas",
        value: "jobs",
        renderer: GroupJobs,
        condition(context, canI) {
            return canI("JOBS", Permission.READ, context.group) && (
                (context.jobs && context.jobs.length > 0)
                || canI("JOBS", Permission.READ_WRITE, context.group)
            );
        },
    },
];
