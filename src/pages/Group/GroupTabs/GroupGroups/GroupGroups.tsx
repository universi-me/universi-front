import { useContext, useState } from "react";
import { GroupContext } from "@/pages/Group";
import { setStateAsValue } from "@/utils/tsxUtils";
import { Group } from "@/types/Group";
import { Link } from "react-router-dom";
import { groupImageUrl } from "@/utils/apiUtils";

export function GroupGroups() {
    const groupContext = useContext(GroupContext);
    const [filterGroups, setFilterGroups] = useState<string>("");

    if (!groupContext)
        return null;

    return (
        <section id="groups" className="group-tab">
            <div className="heading">
                <i className="bi bi-building-fill-gear tab-icon"/>
                <h2 className="title">Grupos em {groupContext.group.name}</h2>
                <div className="go-right">
                    <div id="filter-wrapper">
                        <i className="bi bi-search filter-icon"/>
                        <input type="search" name="filter-groups" id="filter-groups" className="filter-input"
                            onChange={setStateAsValue(setFilterGroups)} placeholder={`Buscar grupos em ${groupContext.group.name}`}
                        />
                    </div>
                </div>
            </div>

            <div className="group-list"> { makeGroupList(groupContext.subgroups, filterGroups) } </div>
        </section>
    );
}

const NO_GROUPS_CLASS = "empty-text";
function makeGroupList(groups: Group[], filter: string) {
    if (groups.length === 0) {
        return <p className={NO_GROUPS_CLASS}>Esse grupo não possui grupos.</p>
    }

    const filteredGroups = filter.length === 0
        ? groups
        : groups.filter(c => c.name.toLowerCase().includes(filter.toLowerCase()));

    if (filteredGroups.length === 0) {
        return <p className={NO_GROUPS_CLASS}>Nenhum grupo encontrado com a pesquisa.</p>
    }

    return filteredGroups
        .map(renderGroup);
}

function renderGroup(group: Group) {
    const linkToGroup = `/group${group.path}`;

    return (
        <div className="group-item" key={group.id}>
            <Link to={linkToGroup}>
                <img src={groupImageUrl(group)} />
            </Link>

            <div className="info">
                <Link to={linkToGroup} className="group-name">{group.name}</Link>
                <p className="group-description">{group.description}</p>
            </div>
        </div>
    );
}
