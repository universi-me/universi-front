import { useContext } from "react";
import { Link } from "react-router-dom";
import { GroupContext } from "@/pages/Group";
import { ProfileImage } from "@/components/ProfileImage/ProfileImage";
import "./GroupMembers.css"
import { getFullName } from "@/utils/profileUtils";

export function GroupMembers() {
    const groupContext = useContext(GroupContext);

    const membersCount = (groupContext?.participants.length ?? 0).toLocaleString('pt-BR', {
        minimumIntegerDigits: 2,
        useGrouping: false,
    })

    return (
        groupContext === null ? null :

        <div id="members">
            <div className="heading">
                Membros
                <div className="counter">{membersCount}</div>
            </div>

            <div className="member-list">
                {
                    groupContext.participants.map(member => {
                        return (
                            <Link to={`/profile/${member.user.name}`} className="member-item" key={member.user.name}>
                                <ProfileImage className="image" imageUrl={member.image} noImageColor="#F3F3F3" />
                                <div className="info">
                                    <h2 className="name">{getFullName(member)}</h2>
                                    {/* <h4 className="function">{"(Função)"}</h4> */}
                                </div>
                            </Link>
                        );
                    })
                }
            </div>

            <button className="show-all">Ver todos os membros</button>
        </div>
    );
}