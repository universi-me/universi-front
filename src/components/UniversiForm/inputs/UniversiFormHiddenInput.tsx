import { useContext, useEffect } from "react";
import { UniversiFormContext } from "../UniversiFormContext";
import { useInitialize } from "../utils";

export function UniversiFormHiddenInput<T>( props: Readonly<UniversiFormHiddenInputProps<T>> ) {
    const context = useContext( UniversiFormContext );
    useInitialize( { props, value: props.defaultValue } );

    useEffect( () => {
        context?.set( props.param, props.defaultValue );
    }, [ props.defaultValue ] )

    return null;
}

export type UniversiFormHiddenInputProps<T> = Pick<
    UniversiFormFieldProps<Optional<T>>,
    "param" | "defaultValue"
>;
