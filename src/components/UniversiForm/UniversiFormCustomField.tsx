import { PropsWithChildren, useContext, useEffect } from "react";
import { UniversiFormContext } from "./UniversiFormContext";

export function UniversiFormCustomField<Object>( props: Readonly<UniversiFormCustomFieldProps<Object>> ) {
    const formContext = useContext(UniversiFormContext);

    // todo: props.onChange
    // todo: props.disabled

    useEffect(() => {
        formContext?.addParam(props.param, props.getValue);
    }, [props.getValue])

    if (!props.children)
        return <></>;

    return <fieldset className="universi-form-field">
        <legend>{ props.label }</legend>
        { props.children }
    </fieldset>
};

export type UniversiFormFieldProps<O> = {
    param: string;
    label?: string;

    defaultObject?: O;
    disabled?: boolean;
    required?: boolean;

    onChange?: (object: O | undefined) => any;
    getValue?: (object: O) => any;
};

export type UniversiFormCustomFieldProps<O> = PropsWithChildren<UniversiFormFieldProps<O> & {
    getValue: () => any;
}>;
