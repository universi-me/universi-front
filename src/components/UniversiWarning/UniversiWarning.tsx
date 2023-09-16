import { ReactNode, MouseEvent } from "react";

import { UniversiModal } from "@/components/UniversiModal";

import "./UniversiWarning.less"

export type UniversiWarningProps = {
    children?: ReactNode;

    message:  string;
    heading?: string;

    onClickClose?: (event: MouseEvent<HTMLButtonElement>) => any;
};

export function UniversiWarning(props: UniversiWarningProps) {
    const canClose = props.onClickClose !== undefined;
    const headingMessage = props.heading ?? "Aviso";

    return (
        <UniversiModal>
            <div className="universi-warning">
                <h3 className="heading">{headingMessage}</h3>
                <div className="message-container">
                    <p className="warning-message">{props.message}</p>
                    {props.children}
                    {
                        !canClose ? null :
                        <button className="close-warning" onClick={props.onClickClose}>
                            Fechar
                        </button>
                    }
                </div>
            </div>
        </UniversiModal>
    );
}
