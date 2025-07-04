import { type PropsWithChildren, type HTMLAttributes } from "react";
import { ProfileBio, ProfileGroups } from "@/components/ProfileInfo";

import "./ProfileInfo.less";
import { makeClassName } from "@/utils/tsxUtils";

export type ProfileInfoProps = PropsWithChildren<{
    profile?:      Profile;
    links?:        Link[];
    groups?:       Group[];
    organization?: Group | null;
}> & HTMLAttributes<HTMLDivElement>;

export function ProfileInfo(props: ProfileInfoProps) {
    const { profile, links, groups, organization, children, ...div } = props;

    return <div {...div} className={makeClassName("profile-info-component", div.className)}>
        <div className="profile-bio-groups-container">
            { profile ? <ProfileBio profile={profile} links={links ?? []} organization={organization} /> : null }
            { groups ? <ProfileGroups groups={groups} /> : null }
        </div>
        <div className="profile-info-content">
            { children }
        </div>
    </div>
}
