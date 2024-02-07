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

    return(
        <div {...props.buttonProps} className={className}>
            <i className={makeClassName("bi", props.biIcon ?? "bi-plus")}></i>
            <div className="action-button-name">
                {props.name}
            </div>
        </div>
    )
}
