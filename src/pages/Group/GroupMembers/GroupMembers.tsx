import "./GroupMembers.css"

export type GroupMembersProps = {
    // todo: change to Member[]
    /**
     * Members to render on the member list
     */
    members: string[];

    /**
     * Total member count
     */
    count: number;
};

export function GroupMembers(props: GroupMembersProps) {
    const membersCount = props.count.toLocaleString('pt-BR', {
        minimumIntegerDigits: 2,
        useGrouping: false,
    })

    return (
        <div id="members">
            <div className="heading">
                Membros
                <div className="counter">{membersCount}</div>
            </div>

            <div className="member-list">
                {
                    props.members.map(member => {
                        /* todo: member info from API */
                        return (
                            <div className="member-item" key={member}>
                                {/* todo: member image as <img> */}
                                <div className="image" />
                                <div className="info">
                                    <h2 className="name">{"Nome & Sobrenome"}</h2>
                                    <h4 className="function">{"(Função)"}</h4>
                                </div>
                            </div>
                        );
                    })
                }
            </div>

            <button className="show-all">Ver todos os membros</button>
        </div>
    );
}