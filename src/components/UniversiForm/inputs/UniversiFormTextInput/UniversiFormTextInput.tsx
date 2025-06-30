import { useContext, useState } from "react";
import type { RefAttributes, InputHTMLAttributes, TextareaHTMLAttributes, ChangeEvent } from "react";

import { makeClassName } from "@/utils/tsxUtils";
import { UniversiFormContext } from "../../UniversiFormContext";
import { FieldHelp, RequiredIndicator, handleValidation, useInitialize } from "../../utils";

import formStyles from "../../UniversiForm.module.less";
import styles from "./UniversiFormTextInput.module.less";


export function UniversiFormTextInput<L extends Optional<boolean> = undefined>( props: Readonly<UniversiFormTextInputProps<L>> ) {
    const { param, label, omitCharLimit, onChange, className, required, validations, isLongText, ...fieldElementProps } = props;
    const context = useContext( UniversiFormContext );

    const [ value, setValue ] = useState<string>( props.defaultValue ?? "" );
    const [ valid, setValid ] = useState<boolean>();
    useInitialize( { props, value, setValid } );

    const isFull = Boolean( props.maxLength && ( value.length >= props.maxLength ) );
    const fieldProps = {
        name: param,
        rows: isLongText ? 5 : undefined,
        ...fieldElementProps,
        className: makeClassName(
            className,
            styles.input,
            isLongText && styles.long_text,
            handleValidation( valid, styles.valid, styles.invalid ),
        ),
        onChange: ( e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement> ) => {
            handleOnChange( e.currentTarget.value );
        }
    };

    return <fieldset className={ formStyles.fieldset }>
        <legend className={ styles.legend }>
            { label } <RequiredIndicator required={required} />
            { props.maxLength && !omitCharLimit && <div className={ makeClassName( styles.char_counter, isFull && styles.full_char_counter ) }>
                { value.length ?? 0 } / { props.maxLength }
            </div> }
        </legend>
        { isLongText
            ? <textarea { ...fieldProps as UniversiFormTextInputFieldProps<true> } />
            : <input { ...fieldProps as UniversiFormTextInputFieldProps<false | undefined> } />
        }
        <FieldHelp>{ props.help }</FieldHelp>
    </fieldset>

    async function handleOnChange( newValue: string ) {
        await context?.set( param, newValue );
        setValue( newValue );
        setValid( context?.getValidation( param ) );

        onChange?.( newValue );
    }
}

export type UniversiFormTextInputProps<LongText extends Optional<boolean>> = Merge<
    UniversiFormFieldProps<string>,
    UniversiFormTextInputFieldProps<LongText>
> & RefAttributes<
    LongText extends true
        ? HTMLTextAreaElement
        : HTMLInputElement
> & {
    omitCharLimit?: boolean;
    isLongText?: LongText;
};

type UniversiFormTextInputFieldProps<L extends Optional<boolean>> = L extends true
    ? Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "defaultChecked" | "onChange">
    : Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "checked" | "defaultChecked" | "onChange"> & {
        type?: "text" | "email" | "search" | "url";
    };
