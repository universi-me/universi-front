import {useState} from "react"

import "./SelectionBar.css"
import { ProfileContentListing } from "../ProfileContentListing/ProfileContentListing"
import { ProfileGroupListing } from "../ProfileGroupListing/ProfileGroupListing"
import { ProfileCurriculum } from "../ProfileCurriculum/ProfileCurriculum";
import { makeClassName } from "@/utils/tsxUtils";

export function SelectionBar(){
    const [currentTab, setCurrentTab] = useState("groups");
    const renderTabs = TABS.length > 1;

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

type TabDefinition = {
    name: string;
    value: string;
};

const TABS: TabDefinition[] = [
    // {
    //     name: "Conteúdos",
    //     value: "content",
    // },
    // {
    //     name: "Arquivos",
    //     value: "files",
    // },
    {
        name: "Grupos",
        value: "groups",
    },
    {
        name: "Currículo",
        value: "curriculum",
    },
];


function renderTab(tabValue : string){
    if(tabValue == "content")
        return <ProfileContentListing title="Conteúdos"/>
    if(tabValue == "files")
        return <ProfileContentListing title="Arquivos"/>
    if(tabValue == "groups")
        return <ProfileGroupListing/>
    if(tabValue == "curriculum")
    return <ProfileCurriculum/>
}
