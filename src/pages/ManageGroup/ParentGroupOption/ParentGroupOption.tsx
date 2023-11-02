import { FormatOptionLabelMeta } from "react-select"

import { ProfileImage } from "@/components/ProfileImage/ProfileImage";
import { Group } from "@/types/Group";
import { groupImageUrl } from "@/utils/apiUtils";

import "./ParentGroupOption.less"

type ParentGroupOption = Group | null;

export type ParentGroupOptionProps = {
    group: Group;
};

export function ParentGroupLabel(props: ParentGroupOptionProps) {
    return (<div className="parent-group-option">
        <ProfileImage imageUrl={groupImageUrl(props.group)} className="parent-group-img" />
        <p>{props.group.name}</p>
    </div>);
}

export function formatParentGroupLabel(option: ParentGroupOption, meta: FormatOptionLabelMeta<ParentGroupOption>) {
    if (option === null)
        return <></>;

    return <ParentGroupLabel group={option} />
}
