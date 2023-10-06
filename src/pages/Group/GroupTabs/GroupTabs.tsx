import { GroupContents, GroupPeople } from "@/pages/Group";
import "./GroupTabs.less";

export type AvailableTabs = "contents" | "files" | "groups" | "people";

export type GroupTabDefinition = {
    name: string,
    value: AvailableTabs,
};

export type GroupTabsProps = {
    tabs: GroupTabDefinition[];
    currentTab: AvailableTabs;

    changeTab: (tab: AvailableTabs) => any;
};

export function GroupTabs(props: GroupTabsProps) {
    return (
        <nav id="group-tabs"> {
            props.tabs.map(t => {
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
    switch (tab) {
        case "contents":
            return <GroupContents />;
        case "people":
            return <GroupPeople />;

        default:
            return null;
    }
}
