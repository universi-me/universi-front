import { Link } from "react-router-dom";

export type ProfileGroupsProps = {
    count: number;
    groups: string[];
};

export function ProfileGroups(props: ProfileGroupsProps) {
    const groupCount = props.count.toLocaleString('pt-BR', {
        minimumIntegerDigits: 2,
        useGrouping: false,
    })

    return (
        <div className="groups card">
            <div className="section">
                <div className="counter-wrapper">
                    <h2 className="card-heading">Grupos</h2>
                    <h2 className="card-heading counter">{groupCount}</h2>
                </div>

                <div className="items-wrapper">
                    <div className="show-items">
                        {
                            props.groups.map((group) => {
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
                    <Link to={""} className="show-all-items">Ver todos os grupos</Link>
                </div>
            </div>
        </div>
    );
}