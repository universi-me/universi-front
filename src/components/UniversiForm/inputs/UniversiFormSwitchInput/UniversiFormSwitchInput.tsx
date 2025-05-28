import { useContext, useState } from "react";
import * as Switch from "@radix-ui/react-switch";

import { RequiredIndicator, useInitialize } from "../../utils";
import { UniversiFormContext } from "../../UniversiFormContext";

import formStyles from "../../UniversiForm.module.less";
import styles from "./UniversiFormSwitchInput.module.less";


export function UniversiFormSwitchInput( props: Readonly<UniversiFormSwitchInputProps> ) {
    const context = useContext( UniversiFormContext );

    const [ value, setValue ] = useState( props.defaultValue ?? false );
    useInitialize( { props, value } );

    return <fieldset className={ `${formStyles.fieldset} ${styles.fieldset}` }>
        <div className={ `${styles.legend} ${formStyles.legend}` }>
            { props.label } <RequiredIndicator required={ props.required } />
        </div>

        <Switch.Root checked={ value } className={ styles.switch_root } onCheckedChange={ handleToggle } disabled={ props.disabled }>
            <Switch.Thumb className={ styles.thumb }/>
        </Switch.Root>
    </fieldset>

    async function handleToggle( checked: boolean ) {
        await context?.set( props.param, checked );
        setValue( checked );

        props.onChange?.( checked );
    }
}

export type UniversiFormSwitchInputProps = UniversiFormFieldProps<boolean>;
