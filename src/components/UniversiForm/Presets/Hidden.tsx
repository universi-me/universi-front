import { UniversiFormCustomField, UniversiFormFieldProps } from "../UniversiFormCustomField";

export function Hidden<Object>( props : Readonly<HiddenProps<Object>> ) {
    return <UniversiFormCustomField {...props} getValue={ () => props.defaultObject } />
}

export type HiddenProps<O> = UniversiFormFieldProps<O>;
