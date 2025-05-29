import { type HTMLAttributes, type MouseEventHandler, ReactNode } from "react";
import { Portal } from "react-portal"

import { makeClassName } from "@/utils/tsxUtils";

import './UniversiModal.less'

export type UniversiModalProps = {
    /**
     * Content of the modal
     */
    children: ReactNode;

    /**
     * Executed when the overlay is clicked
     */
    onClickOutside?: MouseEventHandler<HTMLDivElement>;

    contentProps?: HTMLAttributes<HTMLDivElement>;
};

/**
 * Renders `props.children` in the middle of the screen and darkens everything outside it.
 * 
 * @returns The JSX.Element of the modal to be drawn if `props.children` evaluates to `true`. Otherwise returns `null`.
 */
export function UniversiModal( props: Readonly<UniversiModalProps> ) {
    if (!props.children)
        return null;

    return (
        <Portal node={document.getElementById("modal-container")}>
            <div className="universi-modal" >
                <div className="universi-modal-overlay" onClick={props.onClickOutside} />
                <div { ...props.contentProps } className={ makeClassName( "universi-modal-content", props.contentProps?.className ) }>
                    { props.children }
                </div>
            </div>
        </Portal>
    );
}
