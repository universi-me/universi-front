import { type HTMLAttributes } from "react";
import { makeClassName } from "@/utils/tsxUtils";

export function MaterialIcon( props: Readonly<MaterialIconProps> ) {
    const { icon, className, ...spanProps } = props;

    return <span
        { ...spanProps }
        className={ makeClassName( "material-symbols-outlined", className ) }
    >{ props.icon }</span>
}

export type MaterialIconProps = {
    icon: string;
} & Omit<HTMLAttributes<HTMLSpanElement>, "children">;
