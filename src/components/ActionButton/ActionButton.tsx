import { HTMLAttributes } from "react"
import "./ActionButton.less"
import { makeClassName } from "@/utils/tsxUtils";

export interface ActionButtonProps{
    name : string
    biIcon?: string;
    buttonProps?: HTMLAttributes<HTMLDivElement>;
}

export function ActionButton(props : ActionButtonProps){
    const className = makeClassName("action-button-container", props.buttonProps?.className);

    const biIcon = props.biIcon
        ? props.biIcon.startsWith("bi-")
            ? props.biIcon
            : "bi-" + props.biIcon
        : "bi-plus"

    return(
        <div {...props.buttonProps} className={className}>
            <span className={`bi ${biIcon}`} />
            <div className="action-button-name">
                {props.name}
            </div>
        </div>
    )
}
