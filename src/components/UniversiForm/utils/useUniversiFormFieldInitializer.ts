import { useContext, useEffect } from "react";
import { UniversiFormContext, UniversiFormContextType } from "../UniversiFormContext";

export function useUniversiFormFieldInitializer( options: Readonly<UseUniversiFormInitializerProps> ) {
    const context = useContext( UniversiFormContext );
    useEffect( () => {
        return context?.initialize(
            options.props.param,
            options.value,
            {
                functions: options.props.validations,
                required: options.props.required,
                setValid: options.setValid,
            },
        );
    }, [
        options.props.param,
        options.props.validations,
        options.props.required,
        options.setValid,
    ] );
}

export type UseUniversiFormInitializerProps = {
    props: UniversiFormFieldProps<any>;
    value?: any;
    setValid?: Parameters<UniversiFormContextType["initialize"]>[2]["setValid"];
};
