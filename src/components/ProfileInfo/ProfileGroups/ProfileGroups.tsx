import { Link } from "react-router-dom";

import type { Group } from "@/types/Group";

export type ProfileGroupsProps = {
    groups: Group[];
};

export function ProfileGroups(props: ProfileGroupsProps) {
    return (
        <div className="groups card">
            <div className="group-section">
                <h1 className="groups-name">Meus grupos</h1>
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
                                            <img src={group.image ?? undefined} alt="" />
                                        </Link>
                                    );
                                })
                            }
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}
