import { useContext } from "react";
import { Link } from "react-router-dom";

import { ProfileContext } from "@/pages/Profile";

export function ProfileGroups() {
    const profileContext = useContext(ProfileContext);

    if (profileContext === null)
        return null;

    const groupCount = profileContext.profileListData.groups.length.toLocaleString('pt-BR', {
        minimumIntegerDigits: 2,
        useGrouping: false,
    })

    return (
        <div className="groups card">
            <div className="group-section">
                <h1 className="groups-name">Meus grupos</h1>
                <div className="items-wrapper">
                    {
                        profileContext.profileListData.groups.length <= 0
                        ? <div className="empty-groups">Não participa de um grupo.</div>
                        : <div className="show-items">
                            {
                                profileContext.profileListData.groups.map((group) => {
                                    return group === undefined ? null : (
                                        <Link to={`/group${group.path}`} className="group-item" title={group.name} key={group.id}>
                                            {/* todo: set group url */}
                                            <img src={group.image} alt="" />
                                        </Link>
                                    );
                                })
                            }
                        </div>
                    }
                    {/* todo: All groups page */}
                </div>
            </div>
        </div>
    );
}