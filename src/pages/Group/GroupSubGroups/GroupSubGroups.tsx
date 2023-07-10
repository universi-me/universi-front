import { Link } from "react-router-dom";
import "./GroupSubGroups.css"

export type GroupSubGroupsProps = {
    // todo: change to Group[]
    /**
     * Array with subgroups to render
     */
    subgroups: string[];

    /**
     * Total number of subgroups
     */
    count: number;
};

export function GroupSubGroups(props: GroupSubGroupsProps) {
    const subgroupCount = props.count.toLocaleString('pt-BR', {
        minimumIntegerDigits: 2,
        useGrouping: false,
    })

    return (
        // todo: card component
        <div id="subgroups" className="card">
            <div className="section">
                <div className="counter-wrapper">
                    <h2 className="card-heading">Subgrupos</h2>
                    <h2 className="card-heading counter">{subgroupCount}</h2>
                </div>

                <div className="items-wrapper">
                    <div className="show-items">
                        {
                            props.subgroups.map((group) => {
                                return (
                                    <Link to={""} className="group item">
                                        {/* todo: set group url */}
                                        {/* todo: render group icon */}
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
