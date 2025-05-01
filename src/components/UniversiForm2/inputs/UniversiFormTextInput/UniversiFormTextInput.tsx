import { type ClassAttributes, type InputHTMLAttributes, useContext, useEffect, useState } from "react";

import { makeClassName } from "@/utils/tsxUtils";
import { UniversiFormContext } from "../../UniversiFormContext";

import formStyles from "../../UniversiForm.module.less";
import styles from "./UniversiFormTextInput.module.less";


export function UniversiFormTextInput( props: Readonly<UniversiFormTextInputProps> ) {
    const { param, label, omitCharLimit, onChange, className, ...inputElementProps } = props;

    const context = useContext( UniversiFormContext );

    const [ value, setValue ] = useState<string>( props.defaultValue ?? "" );
    useEffect( () => { handleOnChange( value ); }, [] );

    const isFull = Boolean( props.maxLength && ( value.length >= props.maxLength ) );

    return <fieldset className={ formStyles.fieldset }>
        <legend className={ styles.legend }>
            { label }
            { props.maxLength && !omitCharLimit && <div className={ makeClassName( styles.char_counter, isFull && styles.full_char_counter ) }>
                { value.length ?? 0 } / { props.maxLength }
            </div> }
        </legend>
        <input
            name={ param }
            className={ makeClassName(
                className,
                styles.input,
            ) }
            { ...inputElementProps }

            onChange={ e => handleOnChange( e.currentTarget.value ) }
        />
    </fieldset>

    function handleOnChange( newValue: string ) {
        context?.set( param, newValue );
        setValue( newValue );

        onChange?.( newValue );
    }
}

export type UniversiFormTextInputProps = UniversiFormFieldPropsMergeWith<string, InputHTMLAttributes<HTMLInputElement>
    & ClassAttributes<HTMLInputElement>>
    & {
        omitCharLimit?: boolean;
    };
