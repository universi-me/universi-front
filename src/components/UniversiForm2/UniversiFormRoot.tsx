import { type ReactNode, type PropsWithChildren, useRef, useMemo, MouseEvent, FormHTMLAttributes, useState } from "react";

import { UniversiModal } from "@/components/UniversiModal";
import BootstrapIcon from "@/components/BootstrapIcon";
import { UniversiFormContext, type UniversiFormContextType } from "./UniversiFormContext";
import { makeClassName } from "@/utils/tsxUtils";

import styles from "./UniversiForm.module.less";


export function UniversiFormRoot( props: Readonly<UniversiFormRootProps> ) {
    const formBody = useRef( new Map<string, any> );
    const validationsMap = useRef( new Map<string, ValidationEntry> );
    const contextValue = useMemo<UniversiFormContextType>( makeFormContext, [] );

    const { title, asModal, callback, children, ...formAttributes } = props;
    const [ isAllValid, setIsAllValid ] = useState<boolean>( true );

    const formRender = <UniversiFormContext.Provider value={ contextValue } >
        <form { ...formAttributes } className={makeClassName( styles.form, formAttributes.className )}>
            <div className={ styles.header }>
                <h1>{ props.title }</h1>
                <button type="button" className={ styles.close_button } onClick={ handleCancel } >
                    <BootstrapIcon icon="x" />
                </button>
            </div>

            <section className={ styles.fields }>
                { props.children }
            </section>

            <section className={ styles.actions }>
                <button type="button" className={ makeClassName( styles.cancel_button ) } onClick={ handleCancel }>
                    <i className="bi bi-x-circle-fill" /> Cancelar
                </button>

                <button type="button" className={ makeClassName( styles.confirm_button ) } onClick={ handleConfirm } disabled={ !isAllValid }>
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
                formBody.current.set( key, value );
                updateValidations( key );
            },
            del( key ) {
                return formBody.current.delete( key );
            },
            setValidations( key, options ) {
                const validationFunctions: UniversiFormFieldValidation<any>[] = [];

                if ( options.required )
                    validationFunctions.push( v => !!v );

                if ( options.validations !== undefined )
                    options.validations.forEach( v => validationFunctions.push( v ) );

                validationsMap.current.set( key, { validations: validationFunctions, valid: true } );
                updateValidations( key );
            },
        }
    }

    async function updateValidations( key: string ) {
        const value = formBody.current.get( key );
        if ( !validationsMap.current.has( key ) ) {
            validationsMap.current.set( key, { valid: true, validations: [] } );
        }

        setIsAllValid( false );
        const responses = await Promise.all(
            validationsMap.current.get( key )!.validations
                .map( validate => validate( value ) )
        );

        validationsMap.current.get( key )!.valid = responses.every( r => r );
        const allValid = validationsMap.current.values().every( v => v.valid );

        setIsAllValid( allValid );
    }
}

export type UniversiFormRootProps = PropsWithChildren<{
    title: Truthy<ReactNode>;
    asModal?: boolean;

    callback( formData: UniversiFormData<Record<string, any>> ): any;
}> & FormHTMLAttributes<HTMLFormElement>;

export type UniversiFormData<T> = {
    confirmed: true;
    body: T;
} | {
    confirmed: false;
    body?: undefined;
};

type ValidationEntry = {
    validations: UniversiFormFieldValidation<any>[];
    valid: boolean;
};
