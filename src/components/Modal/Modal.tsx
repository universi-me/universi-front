import { MouseEventHandler, ReactNode } from "react";
import './Modal.css'

export type ModalProps = {
    /**
     * Content of the modal
     */
    children: ReactNode;

    /**
     * Executed when the overlay is clicked
     */
    onClickOutside?: MouseEventHandler;
};

/**
 * Helps sending information if a modal should render if the modal is out of scope
 * See ProfilePage.tsx and ProfileBio.tsx
 */
export type ModalHelper = {
    shouldRender: boolean;
    onClickOutside?: MouseEventHandler;
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
