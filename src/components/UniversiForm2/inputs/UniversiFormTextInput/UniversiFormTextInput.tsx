import { type RefAttributes, type InputHTMLAttributes, useContext, useEffect, useState } from "react";

import { makeClassName } from "@/utils/tsxUtils";
import { UniversiFormContext } from "../../UniversiFormContext";
import { RequiredIndicator, handleValidation } from "../../utils";

import formStyles from "../../UniversiForm.module.less";
import styles from "./UniversiFormTextInput.module.less";


export function UniversiFormTextInput( props: Readonly<UniversiFormTextInputProps> ) {
    const { param, label, omitCharLimit, onChange, className, required, validations, ...inputElementProps } = props;
    const context = useContext( UniversiFormContext );

    const [ value, setValue ] = useState<string>( props.defaultValue ?? "" );
    const [ valid, setValid ] = useState<boolean>();
    useEffect(
        () => context?.initialize( props.param, value, { functions: props.validations, required: props.required } ),
        [ props.required, props.validations ]
    );

    const isFull = Boolean( props.maxLength && ( value.length >= props.maxLength ) );

    return <fieldset className={ formStyles.fieldset }>
        <legend className={ styles.legend }>
            { label } <RequiredIndicator required={required} />
            { props.maxLength && !omitCharLimit && <div className={ makeClassName( styles.char_counter, isFull && styles.full_char_counter ) }>
                { value.length ?? 0 } / { props.maxLength }
            </div> }
        </legend>
        <input
            name={ param }
            className={ makeClassName(
                className,
                styles.input,
                handleValidation( valid, styles.valid, styles.invalid ),
            ) }
            { ...inputElementProps }

            onChange={ e => handleOnChange( e.currentTarget.value ) }
        />
    </fieldset>

    async function handleOnChange( newValue: string ) {
        await context?.set( param, newValue );
        setValue( newValue );
        setValid( context?.getValidation( param ) );

        onChange?.( newValue );
    }
}

export type UniversiFormTextInputProps = UniversiFormFieldPropsMergeWith<string, InputHTMLAttributes<HTMLInputElement>
    & RefAttributes<HTMLInputElement>>
    & {
        omitCharLimit?: boolean;
    };
