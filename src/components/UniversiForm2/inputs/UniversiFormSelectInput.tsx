import { ReactNode, useContext, useState } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

import { UniversiFormContext } from "../UniversiFormContext";

export function UniversiFormSelectInput<T, M extends boolean=false, C extends boolean=false>( props: Readonly<UniversiFormSelectInputProps<T, M, C>> ) {
    const context = useContext( UniversiFormContext );
    const [ options, setOptions ] = useState<T[]>( props.options );

    const selectProps = {
        options: options,
        defaultValue: props.defaultValue,

        isClearable: props.isClearable,
        isMulti: props.isMultiSelection,
        placeholder: props.placeholder ?? `Selecionar ${ props.label ?? "campo" }`,

        menuPosition: "fixed",
        onChange( newValue: T | readonly T[] ) {
            context?.set( props.param, newValue )

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

    return <fieldset className="universi-form-field">
        <legend>{ props.label }</legend>
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

type UniversiFormSelectInputProps<T, Multi extends boolean, Clear extends boolean> = {
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
