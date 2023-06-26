import { MouseEventHandler, ReactNode } from "react";
import './Modal.css'

export type ModalProps = {
    /**
     * Content of the model
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
export function Modal(props: ModalProps) {
    if (!props.children)
        return null;

    return (
        <div className="modal" >
            <div className="modal-overlay" onClick={props.onClickOutside} />
            <div className="modal-content">
                { props.children }
            </div>
        </div>
    );
}
