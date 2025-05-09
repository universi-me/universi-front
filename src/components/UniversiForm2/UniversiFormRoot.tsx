import { type ReactNode, type PropsWithChildren, useMemo, MouseEvent, FormHTMLAttributes, useState } from "react";

import { UniversiModal } from "@/components/UniversiModal";
import BootstrapIcon from "@/components/BootstrapIcon";
import { UniversiFormContext, type UniversiFormContextType } from "./UniversiFormContext";
import { makeClassName } from "@/utils/tsxUtils";

import styles from "./UniversiForm.module.less";
import { RequiredIndicator } from "./utils";


export function UniversiFormRoot( props: Readonly<UniversiFormRootProps> ) {
    const formData = useMemo( () => new Map<string, FormFieldData>, [] );
    const contextValue = useMemo<UniversiFormContextType>( makeFormContext, [] );

    const { title, asModal, callback, children, allowConfirm, ...formAttributes } = props;
    const [ isAllValid, setIsAllValid ] = useState<boolean>( true );
    const hasRequiredField = formData.values().some( d => d.required );

    const formRender = <UniversiFormContext.Provider value={ contextValue } >
        <div { ...formAttributes } className={makeClassName( styles.form, formAttributes.className )}>
            <div className={ styles.header }>
                <h1>{ props.title }</h1>
                <button type="button" className={ styles.close_button } onClick={ handleCancel } >
                    <BootstrapIcon icon="x" />
                </button>
            </div>
            { hasRequiredField && <p className={ styles.required_explanation }>
                Campos marcados com <RequiredIndicator required hideTitle/> são obrigatórios.
            </p> }

            <section className={ styles.fields }>
                { props.children }
            </section>

            <section className={ styles.actions }>
                <button type="button" className={ makeClassName( styles.cancel_button ) } onClick={ handleCancel }>
                    <i className="bi bi-x-circle-fill" /> Cancelar
                </button>

                <button type="button" className={ makeClassName( styles.confirm_button ) } onClick={ handleConfirm } disabled={ !isAllValid || allowConfirm === false }>
                    <i className="bi bi-check-circle-fill" /> Confirmar
                </button>
            </section>
        </div>
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
        for ( const key of formData.keys() )
            body[ key ] = contextValue.get( key );

        callback( { confirmed: true, body } );
    }

    function makeFormContext(): UniversiFormContextType {
        return {
            get( key ) {
                return formData.get( key )?.value;
            },
            set( key, value ) {
                if ( formData.has( key ) )
                    formData.get( key )!.value = value;

                else formData.set( key, {
                    valid: false,
                    required: false,
                    validations: [],
                    value,
                } );

                return updateValidations( key );
            },
            del( key ) {
                formData.delete( key );
            },
            initialize( key, value, validationOptions ) {
                let validations = validationOptions.functions ?? [];

                if ( validationOptions.required )
                    validations.splice( 0, 0, v => !!v );

                if ( formData.has( key ) )
                    value = formData.get( key )!.value;

                formData.set( key, { value, validations, valid: false, required: validationOptions.required ?? false } );
                updateValidations( key );

                return () => { this.del( key ) };
            },
            getValidation( key ) {
                if ( !formData.has( key ) || !formData.get( key )?.value )
                    // return undefined if key is not present or value evaluates to false
                    return undefined;

                return formData.get( key )!.valid;
            },
        }
    }

    async function updateValidations( key: string ) {
        if ( !formData.has( key ) ) return;

        const value = formData.get( key )!.value;

        setIsAllValid( false );
        const responses = await Promise.all(
            formData.get( key )!.validations
                .map( validate => validate( value ) )
        );

        formData.get( key )!.valid = responses.every( r => r );
        const allValid = formData.values().every( v => v.valid );

        setIsAllValid( allValid );
    }
}

export type UniversiFormRootProps = PropsWithChildren<{
    title: Truthy<ReactNode>;
    asModal?: boolean;

    callback( formData: UniversiFormData<Record<string, any>> ): any;
    allowConfirm?: boolean;
}> & FormHTMLAttributes<HTMLDivElement>;

export type UniversiFormData<T> = {
    confirmed: true;
    body: T;
} | {
    confirmed: false;
    body?: undefined;
};

type FormFieldData = {
    value: any;
    validations: UniversiFormFieldValidation<any>[];
    valid: boolean;
    required: boolean;
};
