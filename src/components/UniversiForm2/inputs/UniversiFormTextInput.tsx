import { type ClassAttributes, type InputHTMLAttributes, useContext, useEffect, useState } from "react";

import { UniversiFormContext } from "../UniversiFormContext";


export function UniversiFormTextInput( props: Readonly<UniversiFormTextInputProps> ) {
    const { param, label, required, onChange, ...inputElementProps } = props;

    const context = useContext( UniversiFormContext );

    const [ value, setValue ] = useState<string>( props.defaultValue ?? "" );
    useEffect( () => { handleOnChange( value ); }, [] );

    return <fieldset className="universi-form-field">
        <legend>
            { props.label }
            { props.maxLength && !props.omitCharLimit && <div className="char-counter">
                { value.length ?? 0 } / { props.maxLength }
            </div> }
        </legend>
        <input
            name={ props.param }
            { ...inputElementProps }

            onChange={ e => handleOnChange( e.currentTarget.value ) }
        />
    </fieldset>

    function handleOnChange( newValue: string ) {
        context?.set( props.param, newValue );
        setValue( newValue );

        props.onChange?.( newValue );
    }
}

export type UniversiFormTextInputProps = UniversiFormFieldPropsMergeWith<string, InputHTMLAttributes<HTMLInputElement> & ClassAttributes<HTMLInputElement>> & {
    omitCharLimit?: boolean;
};
