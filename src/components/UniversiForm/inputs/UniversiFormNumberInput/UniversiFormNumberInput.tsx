import { useContext, useState } from "react";
import { makeClassName } from "@/utils/tsxUtils";
import { UniversiFormContext } from "../../UniversiFormContext";
import { FieldHelp, handleValidation, RequiredIndicator, useInitialize } from "../../utils";

import styles from "./UniversiFormNumberInput.module.less";
import formStyles from "../../UniversiForm.module.less";


export function UniversiFormNumberInput( props: Readonly<UniversiFormNumberInputProps> ) {
    const { param, label, onChange, validations, className, ...inputProps } = props;
    const context = useContext( UniversiFormContext );

    const [ valid, setValid ] = useState<boolean>();
    useInitialize({ props, value: props.defaultValue, setValid });

    return <fieldset className={ formStyles.fieldset }>
        <legend>{ label } <RequiredIndicator required={ props.required }/></legend>
        <input
            { ...inputProps }
            type="number"
            onChange={ e => handleOnChange( e.currentTarget.valueAsNumber ) }
            className={ makeClassName(
                className,
                styles.input,
                handleValidation( valid, styles.valid, styles.invalid ),
            ) }
        />
        <FieldHelp>{ props.help }</FieldHelp>
    </fieldset>

    async function handleOnChange( value: number ) {
        await context?.set( param, value );
        setValid( context?.getValidation( param ) );

        onChange?.( value );
    }
}

export type UniversiFormNumberInputProps = Merge<
    UniversiFormFieldProps<number>,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "checked" | "defaultChecked" | "onChange">
> & React.RefAttributes<HTMLInputElement>;
