import { useContext } from "react";
import { Link } from "react-router-dom";

import { GroupContext } from "@/pages/Group";
import "./GroupIntro.css"
import { groupBannerUrl } from "@/utils/apiUtils";

export type GroupIntroProps = {
};

export function GroupIntro(props: GroupIntroProps) {
    const groupContext = useContext(GroupContext);

    return (
        groupContext === null ? null :

        <div id="group-intro">
            {/* todo: background from API */}
            <div id="banner-wrapper">
                <img id="organization-banner" src={groupBannerUrl(groupContext.group)} />
                <h3 id="group-name">{groupContext.group.name}</h3>
            </div>
        </div>
    );
}
