import { useContext } from "react";
import { Link } from "react-router-dom";

import { GroupContext } from "@/pages/Group";
import { groupBannerUrl } from "@/utils/apiUtils";

import "./GroupIntro.less";

export function GroupIntro() {
    const groupContext = useContext(GroupContext);
    const organization = groupContext?.group.organization ?? undefined;
    const banner = groupContext == null ? null : groupBannerUrl(groupContext.group);

    return (
        groupContext === null ? null :

        <div id="group-intro">
            <div id="banner-wrapper">
                {
                    banner ?
                    <>
                        <img id="organization-banner" src={banner} />
                    </>
                    :
                        <div id="organization-banner" style={{backgroundColor: "var(--primary-color)"}}></div>
                }
                <div className="image-overlay"></div>
                <h3 id="group-name">
                    { organization
                        ? <>
                            {groupContext.group.name}
                          </>
                        : null
                    }
                </h3>
            </div>
        </div>
    );
}
