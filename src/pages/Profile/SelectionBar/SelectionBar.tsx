import {useState} from "react"

import "./SelectionBar.css"
import { ProfileContentListing } from "../ProfileContentListing/ProfileContentListing"
import { ProfileGroupListing } from "../ProfileGroupListing/ProfileGroupListing"
import { makeClassName } from "@/utils/tsxUtils";

export function SelectionBar(){
    const [currentTab, setCurrentTab] = useState<AvailableTabs>("groups");
    const renderTabs = TABS.length > 1;

    return(
        <>
            {
                !renderTabs ? null : 
                <div className="selection-bar">
                    {
                        TABS.map((tab) => {
                            const className = makeClassName("select-element", tab.value === currentTab && "current-tab")
                            return <button key={tab.value} className={className} onClick={() => setCurrentTab(tab.value)}>{tab.name}</button>
                        })
                    }
                </div>
            }
            {renderTab(currentTab)}
        </>
    )
}

export type AvailableTabs = "groups" | "contents";

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
        name: "Conteúdos",
        value: "contents",
    },
];

function renderTab(tab: AvailableTabs) {
    switch (tab) {
        case "contents": return <ProfileContentListing />;
        case "groups":   return <ProfileGroupListing />;
        default: return null;
    }
}
