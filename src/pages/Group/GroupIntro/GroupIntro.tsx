import { useContext } from "react";
import { GroupContext } from "@/pages/Group";
import { ProfileImage } from "@/components/ProfileImage/ProfileImage";
import { GroupTypeToLabel } from "@/types/Group";
import { ICON_VERIFIED } from "@/utils/assets";
import "./GroupIntro.css"

export type GroupIntroProps = {
    /**
     * If true will render a verified icon
     */
    verified: boolean;
}

export function GroupIntro(props: GroupIntroProps) {
    const groupContext = useContext(GroupContext);

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
            </div>
            <div className="type">{GroupTypeToLabel[groupContext.group.type]}</div>
        </div>
    );
}