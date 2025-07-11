import { type ReactNode, type PropsWithChildren, useMemo, MouseEvent, FormHTMLAttributes, useState } from "react";
import { type SweetAlertOptions } from "sweetalert2";

import { UniversiModal } from "@/components/UniversiModal";
import BootstrapIcon from "@/components/BootstrapIcon";
import LoadingSpinner from "@/components/LoadingSpinner";
import { UniversiFormContext, type UniversiFormContextType } from "./UniversiFormContext";
import { makeClassName } from "@/utils/tsxUtils";
import { RequiredIndicator } from "./utils";
import * as SwalUtils from "@/utils/sweetalertUtils";

import styles from "./UniversiForm.module.less";


export function UniversiFormRoot( props: Readonly<UniversiFormRootProps> ) {
    const formData = useMemo( () => new Map<string, FormFieldData>, [] );
    const contextValue = useMemo<UniversiFormContextType>( makeFormContext, [] );

    const { title, inline, callback, children, allowConfirm, skipCancelConfirmation, cancelPopup, confirmButton, cancelButton, allowDelete, deleteAction, deleteButton, style, ...formAttributes } = props;
    const [ isAllValid, setIsAllValid ] = useState<boolean>( true );

    const [ hasRequiredField, setHasRequiredField ] = useState( false );
    const [ handlingFormEnd, setHandlingFormEnd ] = useState( false );

    const formRender = <UniversiFormContext.Provider value={ contextValue } >
        <div { ...formAttributes } className={makeClassName( styles.form, formAttributes.className )} style={ { ...style, display: handlingFormEnd ? "none" : style?.display } }>
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
                { allowDelete && <FormButton type="button" className={ styles.delete_button } onClick={ handleDelete }
                    biIcon={ deleteButton?.biIcon ?? "trash-fill" }
                    text={ deleteButton?.text ?? "Excluir" }
                /> }

                <FormButton type="button" className={ styles.cancel_button } onClick={ handleCancel }
                    biIcon={ cancelButton?.biIcon ?? "x-circle-fill" }
                    text={ cancelButton?.text ?? "Cancelar" }
                />

                <FormButton type="button" className={ styles.confirm_button } onClick={ handleConfirm } disabled={ !isAllValid || allowConfirm === false }
                    biIcon={ confirmButton?.biIcon ?? "check-circle-fill" }
                    text={ confirmButton?.text ?? "Confirmar" }
                />
            </section>
        </div>
        { handlingFormEnd && <LoadingSpinner inline={ inline } /> }
    </UniversiFormContext.Provider>

    return inline
        ? formRender
        : <UniversiModal>{ formRender }</UniversiModal>;

    async function handleCancel( e: MouseEvent<HTMLButtonElement> ) {
        e.preventDefault();
        let shouldCancel = true;

        if ( !skipCancelConfirmation ) {
            const res = await SwalUtils.fireAreYouSure({
                title: "Deseja cancelar esta ação?",
                text: "Todos os campos preenchidos serão perdidos.",
                confirmButtonText: "Continuar cancelamento",
                confirmButtonColor: "var(--wrong-invalid-color)",
                cancelButtonText: "Voltar ao formulário",

                ...cancelPopup,
            });

            shouldCancel = res.isConfirmed;
        }

        if ( shouldCancel ) {
            setHandlingFormEnd( true );
            await callback( { confirmed: false, action: "CANCELED" } );
            setHandlingFormEnd( false );
        }
    }

    function getFormBody() {
        const body: Record<string, any> = {};
        for ( const key of formData.keys() )
            body[ key ] = contextValue.get( key );
        return body;
    }

    async function handleConfirm( e: MouseEvent<HTMLButtonElement> ) {
        e.preventDefault();

        setHandlingFormEnd( true );
        await callback( { confirmed: true, action: "CONFIRMED", body: getFormBody() } );
        setHandlingFormEnd( false );
    }

    async function handleDelete( e: MouseEvent<HTMLButtonElement> ) {
        e.preventDefault();

        if ( !allowDelete ) return;
        const res = await SwalUtils.fireAreYouSure({
            title: `Deseja excluir?`,
            confirmButtonText: "Excluir",
            confirmButtonColor: "var(--font-color-alert)",
        });

        if ( !res.isConfirmed ) return;

        setHandlingFormEnd( true );
        await deleteAction();
        await callback( { confirmed: false, action: "DELETED" } );
        setHandlingFormEnd( false );
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
                    validation: {
                        functions: [],
                        valid: false,
                    },
                    required: false,
                    value,
                } );

                return updateValidations( key );
            },
            del( key ) {
                formData.delete( key );
                updateIsAllValid();
            },
            initialize( key, value, validationOptions ) {
                let validations = validationOptions.functions ?? [];

                if ( validationOptions.required )
                    validations.splice( 0, 0, validateRequired );

                if ( formData.has( key ) )
                    value = formData.get( key )!.value;

                formData.set( key, { value, validation: { functions: validations, valid: false }, required: validationOptions.required ?? false } );
                setHasRequiredField( formData.values().some( d => d.required ) );

                updateValidations( key ).then( () => {
                    validationOptions.setValid?.( this.getValidation( key ) );
                } );

                return () => { this.del( key ) };
            },
            getValidation( key ) {
                if ( !formData.has( key ) || !formData.get( key )?.value )
                    // return undefined if key is not present or value evaluates to false
                    return undefined;

                return formData.get( key )!.validation.valid;
            },
        }
    }

    function updateIsAllValid() {
        setIsAllValid( formData.values().every( v => v.validation.valid ) );
    }

    async function updateValidations( key: string ) {
        if ( !formData.has( key ) ) return;

        const value = formData.get( key )!.value;

        setIsAllValid( false );
        const body = getFormBody();
        const responses = await Promise.all(
            formData.get( key )!.validation.functions
                .map( validate => validate( value, body ) )
        );

        formData.get( key )!.validation.valid = responses.every( r => r );
        updateIsAllValid();
    }

    function validateRequired( value: any ): boolean {
        return !!value
            && ( !Array.isArray( value ) || value.length > 0 );
    }
}

export type UniversiFormRootProps = PropsWithChildren<{
    title: Truthy<ReactNode>;
    inline?: boolean;

    skipCancelConfirmation?: boolean;
    cancelPopup?: SweetAlertOptions;

    callback( formData: UniversiFormData<Record<string, any>> ): any;
    allowConfirm?: boolean;
    confirmButton?: Partial<UniversiFormButton>;
    cancelButton?: Partial<UniversiFormButton>;
    deleteButton?: Partial<UniversiFormButton>;
}> & ({
    allowDelete?: false;
    deleteAction?(): unknown;
} | {
    allowDelete: true;
    deleteAction(): unknown;
}) & FormHTMLAttributes<HTMLDivElement>;

type UniversiFormButton = {
    text: string;
    biIcon: string;
};

function FormButton( props: Readonly<FormButtonProps> ) {
    const { text, biIcon, ...buttonProps } = props;

    return <button { ...buttonProps }>
        <BootstrapIcon icon={ biIcon } />
        { text }
    </button>;
}

type FormButtonProps = UniversiFormButton
    & React.ButtonHTMLAttributes<HTMLButtonElement>
    & React.HTMLAttributes<HTMLButtonElement>;

export type UniversiFormData<T> = {
    confirmed: true;
    action: "CONFIRMED";
    body: T;
} | {
    confirmed: false;
    action: "CANCELED" | "DELETED";
    body?: undefined;
};

type FormFieldData = {
    value: any;
    validation: {
        functions: UniversiFormFieldValidation<any>[];
        valid: boolean;
    };
    required: boolean;
};
