import { Link } from "react-router-dom";

import type { Group } from "@/types/Group";
import { groupImageUrl } from "@/utils/apiUtils";

import "./ProfileGroups.less";

export type ProfileGroupsProps = {
    groups: Group[];
};

export function ProfileGroups(props: Readonly<ProfileGroupsProps>) {
    const { groups } = props;

    return <div className="profile-groups-component">
        <div className="header-container">
            <img src="/assets/imgs/group2.png" className="group-background-image" />
            <h1 className="groups-name">Meus grupos</h1>
        </div>

        <div className="items-wrapper">
            { groups.length <= 0
                ? <div className="empty-groups">Não participa de um grupo.</div>
                : <div className="show-items">
                    { groups.map(g => <GroupIcon group={g} key={g.id} />) }
                  </div>
            }
        </div>
    </div>;
}

type GroupIconProps = {
    group: Group;
};

function GroupIcon(props: Readonly<GroupIconProps>) {
    const { group } = props;

    return <Link to={`/group${group.path}`} className="group-item" title={group.name} key={group.id}>
        <img src={groupImageUrl(group)} alt="" />
        <p className="group-item-name">{ group.name }</p>
    </Link>
}
