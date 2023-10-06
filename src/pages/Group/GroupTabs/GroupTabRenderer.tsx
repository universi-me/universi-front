import { GroupContents, AvailableTabs } from "@/pages/Group";

export type GroupTabRendererProps = {
    tab: AvailableTabs;
};

export function GroupTabRenderer(props: GroupTabRendererProps) {
    switch (props.tab) {
        case "contents":
            return <GroupContents />;

        default:
            return null;
    }
}
