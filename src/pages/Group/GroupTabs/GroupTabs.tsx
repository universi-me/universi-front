import type { ReactElement } from "react";

import { GroupContents, GroupGroups, GroupPeople } from "@/pages/Group";
import "./GroupTabs.less";

export type AvailableTabs = "contents" | "files" | "groups" | "people";

export type GroupTabDefinition = {
    name: string,
    value: AvailableTabs,
    renderer(): ReactElement | null,
};

export type GroupTabsProps = {
    currentTab: AvailableTabs;
    changeTab: (tab: AvailableTabs) => any;
};

export function GroupTabs(props: GroupTabsProps) {
    return (
        <nav id="group-tabs"> {
            TABS.map(t => {
                return (
                    <button className="group-tab-button" value={t.value} key={t.value} onClick={_ => props.changeTab(t.value)} disabled={t.value === props.currentTab}>
                        {t.name}
                    </button>
                );
            })
        } </nav>
    );
}

export function GroupTabRenderer({tab}: { tab: AvailableTabs }) {
    const renderedTab = TABS.find(t => t.value === tab);

    return renderedTab
        ? renderedTab.renderer()
        : null;
}

const TABS: GroupTabDefinition[] = [
    {
        name: 'Conteúdos',
        value: "contents",
        renderer: GroupContents,
    },
    // {
    //     name: "Arquivos",
    //     value: "files",
    //     renderer: GroupFiles,
    // },
    {
        name: "Grupos",
        value: "groups",
        renderer: GroupGroups,
    },
    {
        name: "Pessoas",
        value: "people",
        renderer: GroupPeople,
    },
];
