import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { EMPTY_LIST_CLASS, GroupContext } from "@/pages/Group";
import { setStateAsValue } from "@/utils/tsxUtils";
import { groupImageUrl } from "@/utils/apiUtils";

import type { Group } from "@/types/Group";
import "./GroupGroups.less";
import { Filter } from "@/components/Filter/Filter";
import { AuthContext } from "@/contexts/Auth";
import { ActionButton } from "@/components/ActionButton/ActionButton";

export function GroupGroups() {
    const groupContext = useContext(GroupContext);
    const [filterGroups, setFilterGroups] = useState<string>("");
    const authContext = useContext(AuthContext);

    if (!groupContext)
        return null;

    return (
        <section id="groups" className="group-tab">
            <div className="heading top-container">
                <div className="go-right">
                    <Filter setter={setFilterGroups} placeholderMessage={`Buscar grupos em ${groupContext.group.name}`}/>
                    {  
                        authContext.profile?.id == groupContext.group.admin.id || authContext.profile?.id == groupContext.group.organization?.admin.id ?
                        <ActionButton name="Criar grupo"/>
                        :
                        <></>
                    }
                </div>
            </div>

            <div className="group-list tab-list"> { makeGroupList(groupContext.subgroups, filterGroups) } </div>
        </section>
    );
}

function makeGroupList(groups: Group[], filter: string) {
    if (groups.length === 0) {
        return <p className={EMPTY_LIST_CLASS}>Esse grupo não possui grupos.</p>
    }

    const filteredGroups = filter.length === 0
        ? groups
        : groups.filter(c => c.name.toLowerCase().includes(filter.toLowerCase()));

    if (filteredGroups.length === 0) {
        return <p className={EMPTY_LIST_CLASS}>Nenhum grupo encontrado com a pesquisa.</p>
    }

    return filteredGroups
        .map(renderGroup);
}

function renderGroup(group: Group) {
    const linkToGroup = `/group${group.path}`;

    return (
        <div className="group-item tab-item" key={group.id}>
            <Link to={linkToGroup}>
                <img className="group-image" src={groupImageUrl(group)} />
            </Link>

            <div className="info">
                <Link to={linkToGroup} className="group-name">{group.name}</Link>
                <p className="group-description">{group.description}</p>
            </div>
        </div>
    );
}
