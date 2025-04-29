import { type ReactNode, type PropsWithChildren, useRef, useMemo, MouseEvent, FormHTMLAttributes } from "react";

import { UniversiModal } from "@/components/UniversiModal";
import { UniversiFormContext, type UniversiFormContextType } from "./UniversiFormContext";
import { makeClassName } from "@/utils/tsxUtils";

export function UniversiFormRoot( props: Readonly<UniversiFormRootProps> ) {
    const formBody = useRef( new Map<string, any> );
    const contextValue = useMemo<UniversiFormContextType>( makeFormContext, [] );

    const { title, asModal, callback, children, ...formAttributes } = props;

    const formRender = <UniversiFormContext.Provider value={ contextValue } >
        <form { ...formAttributes } className={makeClassName( "universi-form", formAttributes.className )}>
            <section className="universi-form-fields">
                { props.children }
            </section>

            <section className="universi-form-actions">
                <button type="button" className="form-action form-cancel" onClick={ handleCancel }>
                    <i className="bi bi-x-circle-fill" /> Cancelar
                </button>

                {/* todo - handle required fields before allowing confirming */}
                <button type="button" className="form-action form-confirm" onClick={ handleConfirm }>
                    <i className="bi bi-check-circle-fill" /> Confirmar
                </button>
            </section>
        </form>
    </UniversiFormContext.Provider>

    return asModal
        ? <UniversiModal>{ formRender }</UniversiModal>
        : formRender;

    function handleCancel( e: MouseEvent<HTMLButtonElement> ) {
        e.preventDefault();
        callback( { confirmed: false, body: undefined } );
    }

    function handleConfirm( e: MouseEvent<HTMLButtonElement> ) {
        e.preventDefault();

        const body: Record<string, any> = {};
        for ( const key of formBody.current.keys() )
            body[ key ] = formBody.current.get( key );

        callback( { confirmed: true, body } );
    }

    function makeFormContext(): UniversiFormContextType {
        return {
            get( key ) {
                return formBody.current.get( key );
            },
            set( key, value ) {
                return formBody.current.set( key, value );
            },
            del( key ) {
                return formBody.current.delete( key );
            },
        }
    }
}

export type UniversiFormRootProps = PropsWithChildren<{
    title: Truthy<ReactNode>;
    asModal?: boolean;

    callback( formData: UniversiFormData<any> ): any;
}> & FormHTMLAttributes<HTMLFormElement>;

export type UniversiFormData<T> = {
    confirmed: true;
    body: T;
} | {
    confirmed: false;
    body?: undefined;
};
