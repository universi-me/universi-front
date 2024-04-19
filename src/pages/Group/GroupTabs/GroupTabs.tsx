import { useContext, type ReactElement, useState, useEffect } from "react";
import { GroupContents, GroupContext, GroupGroups, GroupPeople, GroupFeed, GroupContextType } from "@/pages/Group";
import "./GroupTabs.less";
import UniversimeApi from "@/services/UniversimeApi";
import { AuthContext } from "@/contexts/Auth";
import { GroupSubmenu } from "../GroupSubmenu/GroupSubmenu";
import { GroupCompetences } from "./GroupCompetences/GroupCompetences";
import useCanI, { CanI_SyncFunction } from "@/hooks/useCanI";
import { Permission } from "@/types/Roles";

export type AvailableTabs = "feed" | "contents" | "groups" | "people" | "competences";

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
    const [joined, setJoined] = useState(auth.profile != null ? context?.loggedData.isParticipant : false)

    const canI = useCanI();

    useEffect(()=>{
        setJoined(auth.profile != null ? context?.loggedData.isParticipant : false)
    },[context?.group])

    async function join(){
        if(!context?.group.canEnter || context.group.id == null)
            return;

        const resData = await UniversimeApi.Group.join({groupId: context.group.id});
        if(resData.success) {
            setJoined(true)
            auth.updateLoggedUser()
                .then(() => context.refreshData())
        };
    }

    async function leave(){
        if(context?.group.id == null)
            return;

        const resData = await UniversimeApi.Group.exit({groupId: context.group.id});
        if(resData.success) {
            setJoined(false)
            auth.updateLoggedUser()
                .then(() => context.refreshData())
        };
    }

    

    return (
        <nav id="group-tabs"> 
        {
            TABS.map(t => {
                const isCurrentTab = t.value === props.currentTab;
                const render = t.condition?.(context!, canI) ?? true;

                return render && <button className={`group-tab-button`} value={t.value} key={t.value} onClick={() => { window.location.hash = t.value; props.changeTab(t.value); }} data-current-tab={isCurrentTab ? "" : undefined}>
                    {t.name}
                </button>;
            })
        }
        
         
         {   context?.group.canEnter && !context.group.rootGroup?
                joined && !context.group.rootGroup?
                <GroupSubmenu leave={leave}/>
                :
                <button className="group-tab-participacao" onClick={join}>Participar</button> 
            : <></>
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
            return canI("FEED", Permission.READ_WRITE, context.group) ||
                (canI("FEED", Permission.READ, context.group) && context.posts.length > 0);
        },
    },
    {
        name: 'Conteúdos',
        value: "contents",
        renderer: GroupContents,
        condition(context, canI) {
            if (!canI("CONTENT", Permission.READ, context.group))
                return false;

            return context.folders.length > 0
                || canI("CONTENT", Permission.READ_WRITE, context.group);
        },
    },
    {
        name: "Grupos",
        value: "groups",
        renderer: GroupGroups,
        condition(context, canI) {
            return canI("GROUP", Permission.READ_WRITE, context.group) ||
                (canI("GROUP", Permission.READ, context.group) && context.subgroups.length > 0);
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
];
