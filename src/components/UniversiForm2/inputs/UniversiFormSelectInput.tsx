import { ReactNode, useContext, useEffect, useState } from "react";
import Select, { type StylesConfig } from "react-select";
import CreatableSelect from "react-select/creatable";

import { UniversiFormContext } from "../UniversiFormContext";
import { handleValidation, RequiredIndicator } from "../utils";

import formStyles from "../UniversiForm.module.less";


export function UniversiFormSelectInput<T, M extends Optional<boolean>=undefined, C extends Optional<boolean>=undefined>(
    props: Readonly<UniversiFormSelectInputProps<T, M, C>>
) {
    const context = useContext( UniversiFormContext );
    useEffect( () => {
        context?.setValidations( props.param, { required: props.required, validations: props.validations } );
    }, [ props.required, props.validations ] );

    const [ options, setOptions ] = useState<T[]>( props.options );
    const [ valid, setValid ] = useState<boolean>();

    const selectProps = {
        options: options,
        defaultValue: props.defaultValue,

        isClearable: props.isClearable,
        isMulti: props.isMultiSelection,
        placeholder: props.placeholder ?? `Selecionar ${ props.label ?? "campo" }`,

        styles: {
            ...props.style,
            control: props.style?.control ?? ( b => {
                const outlineColor = handleValidation(
                    valid,
                    "var(--font-color-success)",
                    "var(--wrong-invalid-color)"
                ) ?? "transparent";

                return {
                    ...b,
                    borderRadius: "10px",
                    outline: `solid 2px ${outlineColor} !important`,
                }
            }),
        },

        menuPosition: "fixed",
        async onChange( newValue: T | readonly T[] ) {
            await context?.set( props.param, newValue );
            setValid( context?.getValidation( props.param ) );

            // use of `as any` because function type was already validated at component creation
            props.onChange?.( newValue as any );
        },
        getOptionLabel( option: T ) {
            return props.getOptionLabel?.( option ) ?? String( option );
        },
        noOptionsMessage( { inputValue }: { inputValue: string } ) {
            return props.optionNotFoundMessage?.( inputValue ) ?? `Não foi possível encontrar ${ inputValue }`;
        },

        getOptionValue: props.getOptionUniqueValue,
        filterOption: props.filterOption ?? undefined,
    };

    return <fieldset className={ formStyles.fieldset }>
        <legend>{ props.label }<RequiredIndicator required={props.required}/></legend>
        { props.canCreateOptions
            ? <CreatableSelect {...selectProps}
                formatCreateLabel={ ( value: string ) => props.createOptionLabel?.( value ) ?? `Criar "${value}"` }
                onCreateOption={ handleOptionCreation }/>
            : <Select {...selectProps} />
        }
    </fieldset>

    function handleOptionCreation( value: string ) {
        const newOptions = props.onCreateOption!( value );
        setOptions( newOptions );
    }
}

type UniversiFormSelectInputProps<T, Multi extends Optional<boolean>, Clear extends Optional<boolean>> = {
    options: T[];
    getOptionUniqueValue( option: T ): string;
    getOptionLabel?( option: T ): Truthy<ReactNode>;
    filterOption?( option: T, search: string ): boolean;

    isSearchable?: boolean;
    optionNotFoundMessage?( search: string ): Truthy<ReactNode>;

    createOptionLabel?( value: string ): Truthy<ReactNode>;

    placeholder?: string;

    isMultiSelection?: Multi;
    isClearable?: Clear;

    style?: StylesConfig<T, Multi extends true ? true : false>;
} & UniversiFormFieldProps<
    Multi extends true ? T[]
    : Clear extends true ? Nullable<T>
    : T
> & CreationBasedSelectProperties<T>;

type CreationBasedSelectProperties<T> = {
    canCreateOptions: true;
    onCreateOption( value: string ): T[];
} | {
    canCreateOptions?: false;
    onCreateOption?( value: string ): T[];
};
