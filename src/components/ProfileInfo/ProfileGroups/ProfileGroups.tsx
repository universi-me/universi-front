import { Link } from "react-router-dom";

import { groupImageUrl } from "@/utils/apiUtils";

import "./ProfileGroups.less";

export type ProfileGroupsProps = {
    groups: Group[];
};

export function ProfileGroups(props: Readonly<ProfileGroupsProps>) {
    const { groups } = props;

    const regularGroups = groups.filter( g => g.regularGroup );

    return <div className="profile-groups-component">
        <div className="header-container">
            <img src="/assets/imgs/group2.png" className="group-background-image" />
            <h1 className="groups-name">Meus grupos</h1>
        </div>

        <div className="items-wrapper">
            { regularGroups.length <= 0
                ? <div className="empty-groups">Não participa de um grupo.</div>
                : <div className="show-items">
                    { regularGroups.map(g => <GroupIcon group={g} key={g.id} />) }
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
