import { FormatOptionLabelMeta } from "react-select"

import { ProfileImage } from "@/components/ProfileImage/ProfileImage";
import { Group } from "@/types/Group";

import "./ParentGroupOption.less"

type ParentGroupOption = Group | null;

export type ParentGroupOptionProps = {
    group: Group;
};

export function ParentGroupLabel(props: ParentGroupOptionProps) {
    return (<div className="parent-group-option">
        <ProfileImage imageUrl={props.group.image} className="parent-group-img" />
        <p>{props.group.name}</p>
    </div>);
}

export function formatParentGroupLabel(option: ParentGroupOption, meta: FormatOptionLabelMeta<ParentGroupOption>) {
    if (option === null)
        return <></>;

    return <ParentGroupLabel group={option} />
}
