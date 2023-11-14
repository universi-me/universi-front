import "./ActionButton.less"

export interface ActionButtonProps{
    name : string
}

export function ActionButton(props : ActionButtonProps){


    return(
        <div className="action-button-container">
            <i className="bi bi-plus"></i>
            <div className="action-button-name">
                {props.name}
            </div>
        </div>
    )


}