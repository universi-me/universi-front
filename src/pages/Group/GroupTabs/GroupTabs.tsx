import { useContext, type ReactElement, useMemo, useState, useEffect } from "react";

import { GroupContents, GroupContext, GroupGroups, GroupPageLoaderResponse, GroupPeople } from "@/pages/Group";
import "./GroupTabs.less";
import { useLoaderData } from "react-router-dom";
import { Group } from "@/types/Group";
import UniversimeApi from "@/services/UniversimeApi";

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

export function GroupTabs(props: GroupTabsProps){

    let page = useLoaderData() as GroupPageLoaderResponse;
    const context = useContext(GroupContext);

    const [joined, setJoined] = useState<boolean>(containsGroup())

    function containsGroup(){
        const userGroups : (Group | undefined)[] | undefined = page.loggedData?.groups;
        if(!userGroups)
            return false;

        for (const value of userGroups){
            if (context?.group.id.trim()  == value?.id.trim()){
                return true;
            }
        }
        return false;
    }

    function join(){
        context?.group.id != undefined ? UniversimeApi.Group.join({groupId: context.group.id}) : null;
        setJoined(containsGroup())
        location.reload()
    }

    function leave(){
        context?.group.id != undefined ? UniversimeApi.Group.exit({groupId: context?.group.id}): null; // enviar mensagem que deu errado;
        setJoined(containsGroup())
        location.reload()
    }


    return (
        <nav id="group-tabs"> 
        {
            TABS.map(t => {
                return (
                    <button className="group-tab-button" value={t.value} key={t.value} onClick={_ => props.changeTab(t.value)} disabled={t.value === props.currentTab}>
                        {t.name}
                    </button>
                );
            })
        }
        {
            joined ? 
            <button className="group-tab-button group-tab-participacao" onClick={leave}>Sair</button> 
            :
            <button className="group-tab-button group-tab-participacao" onClick={join}>Participar</button> 
        }

         </nav>
    );
}

export function GroupTabRenderer({tab}: { tab: AvailableTabs }) {
    const renderedTab = TABS.find(t => t.value === tab);

    return renderedTab
        ? renderedTab.renderer()
        : null;
}

export const EMPTY_LIST_CLASS = "empty-text";

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
