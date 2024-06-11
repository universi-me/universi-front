import {useContext, useEffect, useMemo, useState} from "react"

import "./SelectionBar.css"
import { ProfileContext, ProfileContentListing, ProfileGroupListing, ProfileCurriculum, ProfileAssignedByMe, ProfileContextType } from "@/pages/Profile";
import { makeClassName } from "@/utils/tsxUtils";

const INITIAL_TAB: AvailableTabs = "curriculum";
export function SelectionBar(){
    const profileContext = useContext(ProfileContext);
    const [currentTab, setCurrentTab] = useState<AvailableTabs>(INITIAL_TAB);

    useEffect(() => {
        setCurrentTab(INITIAL_TAB);
    }, [profileContext?.profile.user.name]);

    const renderedTabs = useMemo(() => {
        if (!profileContext) return [];

        return TABS.filter(t => !t.visibleIf || t.visibleIf(profileContext));
    }, [profileContext]);

    const shouldRenderTabSelector = renderedTabs.length > 1;

    return(
        <>
            {
                shouldRenderTabSelector &&
                <div className="selection-bar">
                    {
                        renderedTabs.map((tab) => {
                            return <div key={tab.value} className={makeClassName("select-element", currentTab === tab.value && "current-tab")} onClick={() => setCurrentTab(tab.value)}>{tab.name}</div>
                        })
                    }
                </div>
            }
            {renderTab(currentTab)}
        </>
    )
}

export type AvailableTabs = "groups" | "contents" | "curriculum" | "assigned-by-me";

type TabDefinition = {
    name: string;
    value: AvailableTabs;
    visibleIf?(c: NonNullable<ProfileContextType>): boolean;
};

const TABS: TabDefinition[] = [
    {
        name: "Currículo",
        value: "curriculum",
    },
    {
        name: "Grupos",
        value: "groups",
    },
    {
        name: "Conteúdos",
        value: "contents",
    },
    {
        name: "Atribuições",
        value: "assigned-by-me",
        visibleIf(c) {
            return c.profileListData.assignedByMe.length > 0;
        },
    }
];

function renderTab(tab: AvailableTabs) {
    switch (tab) {
        case "contents": return <ProfileContentListing />;
        case "groups":   return <ProfileGroupListing />;
        case "curriculum": return <ProfileCurriculum/>;
        case "assigned-by-me": return <ProfileAssignedByMe />
        default: return null;
    }
}
