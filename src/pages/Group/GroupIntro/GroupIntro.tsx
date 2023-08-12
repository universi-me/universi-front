import { useContext } from "react";
import { GroupContext } from "@/pages/Group";
import { ProfileImage } from "@/components/ProfileImage/ProfileImage";
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
            <ProfileImage style={{backgroundColor: "#f5f4f4"}} className="image" imageUrl={groupContext.group.image} noImageColor="#D9D9D9" />
            <div className="name">
                <h2 >{groupContext.group.name}</h2>
                {
                    props.verified ?
                        <img src="/assets/icons/icon-verificated.svg" className="verified-icon" />
                    : null
                }
            </div>
            <div className="type">{groupContext.group.type}</div>
        </div>
    );
}