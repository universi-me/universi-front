import { Link } from "react-router-dom";

import type { Group } from "@/types/Group";
import { groupImageUrl } from "@/utils/apiUtils";

import "./ProfileGroups.less";

export type ProfileGroupsProps = {
    groups: Group[];
};

export function ProfileGroups(props: ProfileGroupsProps) {


    return (
        <div className="profile-groups-component">
            <div className="header-container">
                <img src="/assets/imgs/group2.png" className="group-background-image"></img>
                <h1 className="groups-name">Meus grupos</h1>
            </div>
            <div className="items-wrapper">
                {
                    props.groups.length <= 0
                    ? <div className="empty-groups">Não participa de um grupo.</div>
                    : <div className="show-items">
                        {
                            props.groups.map((group) => {
                                return group === undefined ? null : (
                                    <Link to={`/group${group.path}`} className="group-item" title={group.name} key={group.id}>
                                        {/* todo: set group url */}
                                        <img src={groupImageUrl(group)} alt="" />
                                    </Link>
                                );
                            })
                        }
                    </div>
                }
            </div>
        </div>
    );
}
