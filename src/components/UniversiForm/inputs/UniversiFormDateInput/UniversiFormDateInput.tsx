import { useContext, useMemo, useState } from "react";
import { UniversiFormContext } from "../../UniversiFormContext";
import { FieldHelp, handleValidation, RequiredIndicator, useInitialize } from "../../utils";

import styles from "./UniversiFormDateInput.module.less";
import formStyles from "../../UniversiForm.module.less";
import { makeClassName } from "@/utils/tsxUtils";
import { dateWithoutTimezone } from "@/utils/dateUtils";


export function UniversiFormDateInput( props: Readonly<UniversiFormDateInputProps> ) {
    const context = useContext( UniversiFormContext );
    const [ valid, setValid ] = useState<boolean>();

    const defaultDate = useMemo( () => {
        return props.defaultValue instanceof Date
            ? props.defaultValue
            : props.defaultValue !== undefined
                ? dateWithoutTimezone( props.defaultValue )
                : undefined;
    }, [] );

    useInitialize( { props, value: defaultDate, setValid } );

    return <fieldset className={ formStyles.fieldset }>
        <legend className={ formStyles.legend }>{ props.label } <RequiredIndicator required={ props.required }/></legend>
        <input
            className={ makeClassName(
                styles.input,
                handleValidation( valid, styles.valid, styles.invalid )
            ) }
            type="date"
            defaultValue={ defaultDate && dateToInputFormat( defaultDate ) }
            onChange={ e => handleOnChange( e.currentTarget.valueAsDate ) }
            disabled={ props.disabled }
            required={ props.required }
        />
        <FieldHelp>{ props.help }</FieldHelp>
    </fieldset>;

    async function handleOnChange( newValue: Nullable<Date> ) {
        const dateValue = newValue
            ? dateWithoutTimezone( newValue.getTime() )
            : undefined;

        await context?.set( props.param, dateValue );
        setValid( context?.getValidation( props.param ) );

        props.onChange?.( dateValue );
    }

    function dateToInputFormat( date: Date ) {
        let month = ( date.getUTCMonth() + 1 ).toString();
        if ( month.length == 1 ) month = `0${month}`;

        let day = ( date.getUTCDate() ).toString();
        if ( day.length == 1 ) day = `0${day}`;

        return `${date.getUTCFullYear()}-${month}-${day}`;
    }
}

export type UniversiFormDateInputProps = Omit<UniversiFormFieldProps<Optional<Date>>, "defaultValue">
    & {
        defaultValue?: Date | string | number;
    };
