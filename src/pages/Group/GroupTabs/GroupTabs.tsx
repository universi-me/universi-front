import { useContext, type ReactElement, useState } from "react";
import { GroupContents, GroupContext, GroupGroups, GroupPeople } from "@/pages/Group";
import "./GroupTabs.less";
import UniversimeApi from "@/services/UniversimeApi";
import { AuthContext } from "@/contexts/Auth";

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

export  function GroupTabs(props: GroupTabsProps){
    const context = useContext(GroupContext);
    const auth = useContext(AuthContext);
    const [joined, setJoined] = useState(auth.profile != null ? context?.loggedData.isParticipant : false)

    async function join(){
        if(!context?.group.canEnter || context.group.id == null)
            return;

        const resData = await UniversimeApi.Group.join({groupId: context.group.id});
        if(resData.success) {
            setJoined(true)
            context.refreshData();
        };
    }

    async function leave(){
        if(context?.group.id == null)
            return;

        const resData = await UniversimeApi.Group.exit({groupId: context.group.id});
        if(resData.success) {
            setJoined(false)
            context.refreshData();
        };
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
        
        
        {   context?.group.canEnter?
                joined && !context.group.rootGroup?
                <button className="group-tab-button group-tab-participacao" onClick={leave}>Sair</button> 
                :
                <button className="group-tab-button group-tab-participacao" onClick={join}>Participar</button> 
            : <></>
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
