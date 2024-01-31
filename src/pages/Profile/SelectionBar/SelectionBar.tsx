import {useContext, useEffect, useState} from "react"

import "./SelectionBar.css"
import { ProfileContext, ProfileContentListing, ProfileGroupListing, ProfileCurriculum } from "@/pages/Profile";
import { makeClassName } from "@/utils/tsxUtils";

const INITIAL_TAB: AvailableTabs = "groups";
export function SelectionBar(){
    const profileContext = useContext(ProfileContext);
    const [currentTab, setCurrentTab] = useState<AvailableTabs>(INITIAL_TAB);
    const renderTabs = TABS.length > 1;

    useEffect(() => {
        setCurrentTab(INITIAL_TAB);
    }, [profileContext?.profile.user.name]);

    return(
        <>
            {
                !renderTabs ? null : 
                <div className="selection-bar">
                    {
                        TABS.map((tab) => {
                            return <div key={tab.value} className={makeClassName("select-element", currentTab === tab.value && "current-tab")} onClick={() => setCurrentTab(tab.value)}>{tab.name}</div>
                        })
                    }
                </div>
            }
            {renderTab(currentTab)}
        </>
    )
}

export type AvailableTabs = "groups" | "contents" | "curriculum";

type TabDefinition = {
    name: string;
    value: AvailableTabs;
};

const TABS: TabDefinition[] = [
    {
        name: "Grupos",
        value: "groups",
    },
    {
        name: "Currículo",
        value: "curriculum",
    },
    {
        name: "Conteúdos",
        value: "contents",
    },
];

function renderTab(tab: AvailableTabs) {
    switch (tab) {
        case "contents": return <ProfileContentListing />;
        case "groups":   return <ProfileGroupListing />;
        case "curriculum": return <ProfileCurriculum/>;
        default: return null;
    }
    if(tabValue == "curriculum")
    return <ProfileCurriculum/>
}
