import { HTMLAttributes } from "react";

import { makeClassName } from "@/utils/tsxUtils";

export function BootstrapIcon(props : Readonly<BootstrapIconProps>) {
    const className = makeClassName("bi", `bi-${props.icon}`, props.className);

    return <span {...props} className={className} />
}

export type BootstrapIconProps = {
    icon: string;
} & HTMLAttributes<HTMLSpanElement>;
