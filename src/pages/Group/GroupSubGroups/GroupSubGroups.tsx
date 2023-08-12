import { Link } from "react-router-dom";
import { useContext } from "react";
import { GroupContext } from "@/pages/Group";
import "./GroupSubGroups.css"

export function GroupSubGroups() {
    const groupContext = useContext(GroupContext);

    const subgroupCount = (groupContext?.group.subGroups.length ?? 0).toLocaleString('pt-BR', {
        minimumIntegerDigits: 2,
        useGrouping: false,
    })

    return (
        groupContext === null || groupContext.subgroups.length <= 0 ? null :

        <div id="subgroups" className="card">
            <div className="section">
                <div className="counter-wrapper">
                    <h2 className="card-heading">Subgrupos</h2>
                    <h2 className="card-heading counter">{subgroupCount}</h2>
                </div>

                <div className="items-wrapper">
                    <div className="show-items">
                        {
                            groupContext.subgroups.map((group) => {
                                return (
                                    <Link to={`/group/${group.nickname}`} className="group item" key={group.nickname} title={group.name}>
                                        {/* todo: set group url */}
                                        {group.image ? <img src={group.image} /> : null}
                                    </Link>
                                );
                            })
                        }
                    </div>

                    {/* todo: All groups page */}
                    <Link to={""} className="show-all-items">Ver todos os subgrupos</Link>
                </div>
            </div>
        </div>
    );
}
