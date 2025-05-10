import { useContext, useEffect, useState } from "react";
import type { RefAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from "react";

import { makeClassName } from "@/utils/tsxUtils";
import { UniversiFormContext } from "../../UniversiFormContext";
import { RequiredIndicator, handleValidation } from "../../utils";

import formStyles from "../../UniversiForm.module.less";
import styles from "./UniversiFormTextInput.module.less";


export function UniversiFormTextInput<L extends Optional<boolean>>( props: Readonly<UniversiFormTextInputProps<L>> ) {
    const { param, label, omitCharLimit, onChange, className, required, validations, isLongText, ...fieldElementProps } = props;
    const context = useContext( UniversiFormContext );

    const [ value, setValue ] = useState<string>( props.defaultValue ?? "" );
    const [ valid, setValid ] = useState<boolean>();
    useEffect(
        () => context?.initialize( props.param, value, { functions: props.validations, required: props.required, setValid } ),
        [ props.required, props.validations ]
    );

    const isFull = Boolean( props.maxLength && ( value.length >= props.maxLength ) );
    const fieldProps: UniversiFormTextInputFieldProps<L> = {
        name: param,
        className: makeClassName(
            className,
            styles.input,
            isLongText && styles.long_text,
            handleValidation( valid, styles.valid, styles.invalid ),
        ),
        rows: isLongText ? 5 : undefined,
        ...fieldElementProps,
        onChange: ( e: any ) => {
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
            : <input { ...fieldProps as UniversiFormTextInputFieldProps<false | undefined> } type="text" />
        }
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
    ? TextareaHTMLAttributes<HTMLTextAreaElement>
    : Omit<InputHTMLAttributes<HTMLInputElement>, "type">;
