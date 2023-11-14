import { HTMLAttributes } from "react"
import "./ActionButton.less"

export interface ActionButtonProps{
    name : string
    buttonProps?: HTMLAttributes<HTMLDivElement>;
}

export function ActionButton(props : ActionButtonProps){
    const className = ["action-button-container", props.buttonProps?.className]
        .filter(c => !!c && c.length > 0)
        .join(" ");


    return(
        <div {...props.buttonProps} className={className}>
            <i className="bi bi-plus"></i>
            <div className="action-button-name">
                {props.name}
            </div>
        </div>
    )


}