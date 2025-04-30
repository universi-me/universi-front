import { type HTMLAttributes } from "react";

export function MaterialIcon( props: Readonly<MaterialIconProps> ) {
    return <span className="material-symbols-outlined">{ props.icon }</span>
}

export type MaterialIconProps = {
    icon: string;
} & HTMLAttributes<HTMLSpanElement>;
