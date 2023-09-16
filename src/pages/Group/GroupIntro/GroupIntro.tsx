import { useContext } from "react";
import { Link } from "react-router-dom";

import { GroupContext } from "@/pages/Group";
import { EDIT_GROUP_PARAMETER } from "@/pages/ManageGroup";
import { AuthContext } from "@/contexts/Auth";
import { ProfileImage } from "@/components/ProfileImage/ProfileImage";
import { GroupTypeToLabel } from "@/types/Group";
import { ICON_VERIFIED, ICON_EDIT_BLACK } from "@/utils/assets";
import "./GroupIntro.css"

export type GroupIntroProps = {
    /**
     * If true will render a verified icon
     */
    verified: boolean;
}

export function GroupIntro(props: GroupIntroProps) {
    const groupContext = useContext(GroupContext);
    const authContext = useContext(AuthContext);

    return (
        groupContext === null ? null :

        <div id="group-intro">
            <ProfileImage className="image" imageUrl={groupContext.group.image} noImageColor="var(--card-background-color)" />
            <div className="name">
                <h2 >{groupContext.group.name}</h2>
                {
                    props.verified ?
                        <img src={ICON_VERIFIED} className="verified-icon" />
                    : null
                }
                {
                    groupContext.group.admin.user.id === authContext?.user?.id
                    ? <Link title="Editar dados grupo" className="edit-group-button" to={`/manage-group?${EDIT_GROUP_PARAMETER}=${groupContext.group.path}`}>
                        <img src={ICON_EDIT_BLACK} />
                      </Link>
                    : null
                }
            </div>
            <div className="type">{GroupTypeToLabel[groupContext.group.type]}</div>
        </div>
    );
}