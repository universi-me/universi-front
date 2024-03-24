import { type PropsWithChildren, type HTMLAttributes } from "react";
import { ProfileBio, ProfileGroups } from "@/components/ProfileInfo";

import { type Profile } from "@/types/Profile";
import { type Link } from "@/types/Link";
import { type Group } from "@/types/Group";

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
        <div id="group-page-container" className="group-page-container">
            { children }
        </div>
    </div>
}
