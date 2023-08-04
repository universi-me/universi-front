import { useContext } from "react";
import { Link } from "react-router-dom";

import { ProfileContext } from "@/pages/Profile";

export function ProfileGroups() {
    const profileContext = useContext(ProfileContext);

    if (profileContext === null)
        return null;

    const groupCount = profileContext.profile.groups.length.toLocaleString('pt-BR', {
        minimumIntegerDigits: 2,
        useGrouping: false,
    })

    return (
        profileContext.profile.groups.length <= 0 ? null :

        <div className="groups card">
            <div className="section">
                <div className="counter-wrapper">
                    <h2 className="card-heading">Grupos</h2>
                    <h2 className="card-heading counter">{groupCount}</h2>
                </div>

                <div className="items-wrapper">
                    <div className="show-items">
                        {
                            profileContext.profile.groups.map((groupId) => {
                                const group = profileContext.groups[groupId];
                                return group === undefined ? null : (
                                    <Link to={""} className="group item" title={group.name} key={groupId}>
                                        {/* todo: set group url */}
                                        <img src={group.image} alt="" />
                                    </Link>
                                );
                            })
                        }
                    </div>

                    {/* todo: All groups page */}
                    <Link to={""} className="show-all-items">Ver todos os grupos</Link>
                </div>
            </div>
        </div>
    );
}