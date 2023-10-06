import { GroupContents, GroupPeople, AvailableTabs } from "@/pages/Group";
import "./GroupTabs.less";

export type GroupTabRendererProps = {
    tab: AvailableTabs;
};

export function GroupTabRenderer(props: GroupTabRendererProps) {
    switch (props.tab) {
        case "contents":
            return <GroupContents />;
        case "people":
            return <GroupPeople />;

        default:
            return null;
    }
}
