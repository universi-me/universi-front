import { HTMLAttributes } from "react";

import { makeClassName } from "@/utils/tsxUtils";

export function BootstrapIcon(props : Readonly<BootstrapIconProps>) {
    let { icon, className, ...spanProps } = props;

    if ( icon.startsWith( "bi-" ) )
        icon = icon.slice( 3 );

    return <span {...spanProps} className={ makeClassName( "bi", `bi-${icon}`, className ) } />
}

export type BootstrapIconProps = {
    icon: string;
} & HTMLAttributes<HTMLSpanElement>;
