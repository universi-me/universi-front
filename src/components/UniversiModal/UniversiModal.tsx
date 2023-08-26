import { MouseEventHandler, ReactNode } from "react";
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
};

/**
 * Renders `props.children` in the middle of the screen and darkens everything outside it.
 * 
 * @returns The JSX.Element of the modal to be drawn if `props.children` evaluates to `true`. Otherwise returns `null`.
 */
export function UniversiModal(props: UniversiModalProps) {
    if (!props.children)
        return null;

    return (
        <div className="universi-modal" >
            <div className="universi-modal-overlay" onClick={props.onClickOutside} />
            <div className="universi-modal-content">
                { props.children }
            </div>
        </div>
    );
}
