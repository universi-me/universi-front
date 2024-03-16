import { Link } from "react-router-dom";

import type { Group } from "@/types/Group";
import { groupImageUrl } from "@/utils/apiUtils";

import "./ProfileGroups.less";

export type ProfileGroupsProps = {
    groups: Group[];
};

export function ProfileGroups(props: ProfileGroupsProps) {


    //Making the first group be the organization group
    for(let i = 0; i<props.groups.length; i++){

        let group : Group = props.groups[i];

        //switching groups
        //Root group is now stored in position 0
        //previous group is now stored where the root
        //  group was stored before the switch
        if(group.rootGroup){
            let tmpGroup = props.groups[0];
            props.groups[0] = group;
            props.groups[i] = tmpGroup;
        }

    }

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
