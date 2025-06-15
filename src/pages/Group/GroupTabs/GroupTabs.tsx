import { useContext, useEffect, useMemo, type ReactElement } from "react";
import { GroupContents, GroupContext, GroupGroups, GroupPeople, GroupFeed, GroupContextType, GroupJobs, GroupActivities } from "@/pages/Group";
import "./GroupTabs.less";
import { UniversimeApi } from "@/services"
import { AuthContext } from "@/contexts/Auth";
import { GroupSubmenu } from "../GroupSubmenu/GroupSubmenu";
import { GroupCompetences } from "./GroupCompetences/GroupCompetences";
import useCanI, { CanI_SyncFunction } from "@/hooks/useCanI";
import { Permission } from "@/utils/roles/rolesUtils";

export type AvailableTabs = "feed" | "contents" | "groups" | "people" | "competences" | "jobs" | "activities";

export type GroupTabDefinition = {
    name: string,
    value: AvailableTabs,
    renderer(): ReactElement | null,
    condition?(context: NonNullable<GroupContextType>, canI: CanI_SyncFunction): boolean;
};

export type GroupTabsProps = {
};

export function GroupTabs(props: Readonly<GroupTabsProps>) {
    const context = useContext(GroupContext);
    const auth = useContext(AuthContext);
    const canI = useCanI();

    const renderedTabs = useMemo(() => {
        if (!context) return [];

        return TABS
            .filter(t => t.condition?.(context, canI) ?? true);
    }, [ context?.group, auth.profile ]);

    useEffect(() => {
        if (context?.currentTab === undefined || renderedTabs.length === 0)
            return;

        const tabDefinition = renderedTabs
            .find(t => t.value === context.currentTab);

        context.setCurrentTab( tabDefinition ? tabDefinition.value : renderedTabs[0].value );

    }, [ context?.currentTab, renderedTabs ]);

    // Set the initial tab when the group changes
    useEffect(() => {
        if (!context || !context.group || renderedTabs.length === 0)
            return;

        let tabNameSplit : string[] = window.location.hash.substring(1).split('/') ?? [];
        let tabName = tabNameSplit.length > 0 ? tabNameSplit[0] : null;
        let useDefaultTab = true;

        if(tabName) {
            const tab = asTabAvailable(tabName);

            if (tab) {
                useDefaultTab = false;
                context?.setCurrentTab(tabName as AvailableTabs);
            }

            // This is useful for when the user navigates directly to a content page with ID
            if(tab === "contents" && tabNameSplit.length > 1) {
                useDefaultTab = false;
                context!
                    .refreshData({ currentContentId: tabNameSplit[1] })
                    .then( c => c.setCurrentTab(tab));
            }
        }

        if (useDefaultTab) {
            context?.setCurrentTab(renderedTabs[0]?.value ?? "feed" as AvailableTabs);
        }

    }, [ context?.group?.id ]);

    async function join(){
        if(!context?.group.canEnter || context.group.id == null)
            return;

        await UniversimeApi.GroupParticipant.join( context.group.id );
        await Promise.all([
            context.refreshData(),
            auth.updateLoggedUser(),
        ])
    }

    if (!context)
        return <></>;

    const joined = (context.loggedData.groups ?? []).find((g : Group.DTO) => g.id === context.group.id) !== undefined;
    const renderJoinOrLeave = (joined || context.group.canEnter);

    return (
        <nav id="group-tabs"> 
        {
            renderedTabs.map(t => {
                const isCurrentTab = t.value === context.currentTab;

                return <button className={`group-tab-button`} value={t.value} key={t.value} onClick={() => { window.location.hash = t.value; context.setCurrentTab(t.value); }} data-current-tab={isCurrentTab ? "" : undefined}>
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

export function GroupTabRenderer() {
    const context = useContext(GroupContext);
    if (!context) return null;

    const renderedTab = TABS.find(t => t.value === context.currentTab);

    return renderedTab
        ? <renderedTab.renderer />
        : null;
}

export function asTabAvailable(tab: string): Optional<AvailableTabs> {
    return TABS.find(t => t.value === tab) !== undefined
        ? tab as AvailableTabs
        : undefined;
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
            return !!context.jobs
                && canI("JOBS", Permission.READ, context.group)
                && (
                    context.jobs.length > 0
                    || canI( "JOBS", Permission.READ_WRITE, context.group )
                );
        },
    },
    {
        name: "Atividades",
        value: "activities",
        renderer: GroupActivities,
        condition( context, canI ) {
            return !!context.activities
                && canI( "ACTIVITY", Permission.READ, context.group )
                && (
                    context.activities.length > 0
                    || canI( "ACTIVITY", Permission.READ_WRITE, context.group )
                );
        },
    }
];
