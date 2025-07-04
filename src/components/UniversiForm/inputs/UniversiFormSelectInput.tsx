import { ReactNode, useContext, useState } from "react";
import Select, { ActionMeta, type StylesConfig } from "react-select";
import CreatableSelect from "react-select/creatable";

import { UniversiFormContext } from "../UniversiFormContext";
import { handleValidation, RequiredIndicator, useInitialize } from "../utils";

import formStyles from "../UniversiForm.module.less";


export function UniversiFormSelectInput<T extends Record<string, any>, M extends Optional<boolean>=undefined, C extends Optional<boolean>=undefined>(
    props: Readonly<UniversiFormSelectInputProps<T, M, C>>
) {
    const context = useContext( UniversiFormContext );

    const [ options, setOptions ] = useState<T[]>( [ ...props.options ].sort( props.sortOptions ) );
    const [ valid, setValid ] = useState<boolean>();
    useInitialize( { props, value: props.defaultValue, setValid } );

    const selectProps = {
        options: makeOption( options ),
        defaultValue: makeOption( props.defaultValue ),

        isClearable: props.isClearable ?? !props.required,
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
        async onChange( newValue: Nullable<SelectOption | SelectOption[]>, actionMeta: ActionMeta<SelectOption> ) {
            if ( actionMeta.action === "create-option" ) {
                const option = await handleOptionCreation( actionMeta.option.value );
                if ( option ) {
                    newValue = Array.isArray( newValue )
                        ? [ ...newValue.filter( o => o.value !== actionMeta.option.value), makeOption( option ) ]
                        : makeOption( option );
                }
            }

            if ( [ "clear", "select-option", "deselect-option", "create-option" ].includes( actionMeta.action ) )
                await handleOptionSelection( newValue );
        },
        noOptionsMessage( { inputValue }: { inputValue: string } ) {
            return props.optionNotFoundMessage?.( inputValue ) ?? `Não foi possível encontrar ${ inputValue }`;
        },

        filterOption: props.filterOption
            && ( ( option: SelectOption<SelectOption>, search: string ) => props.filterOption!( option.data.data, search ) ),
    };

    return <fieldset className={ formStyles.fieldset }>
        <legend>{ props.label } <RequiredIndicator required={props.required}/></legend>
        { props.canCreateOptions
            ? <CreatableSelect {...selectProps}
                formatCreateLabel={ ( value: string ) => props.createOptionLabel?.( value ) ?? `Criar "${value}"` }
            />
            : <Select {...selectProps} />
        }
    </fieldset>

    async function handleOptionSelection( value: Nullable<SelectOption | SelectOption[]> ) {
        const data = Array.isArray( value )
            ? value.map( o => o.data )
            : value?.data;

        await context?.set( props.param, data );
        setValid( context?.getValidation( props.param ) );

        // use of `as any` because function type was already validated at component creation
        props.onChange?.( data as any );
    }

    async function handleOptionCreation( value: string ) {
        const createdOption = await props.onCreateOption!( value );
        if ( !createdOption ) return;

        const newOptions = [ ...options ];
        if ( createdOption ) newOptions.push( createdOption );

        const handledNewOptions = await props.onUpdateOptions?.( newOptions );

        setOptions( ( handledNewOptions ?? newOptions ).sort( props.sortOptions ) );
        return createdOption;
    }

    function makeOption( data: undefined | null ): undefined;
    function makeOption( data: T ): SelectOption;
    function makeOption( data: T[] ): SelectOption[];
    function makeOption( data: T | T[] ): SelectOption | SelectOption[];
    function makeOption( data: Optional<T> | T[] | null ): SelectOption | SelectOption[] | undefined;
    function makeOption( data: Optional<T> | T[] | null ): SelectOption | SelectOption[] | undefined {
        if ( data === undefined || data === null )
            return undefined;

        if ( Array.isArray( data ) )
            return data.map( d => makeOption( d ) );

        return {
            data,
            label: props.getOptionLabel( data ),
            value: String( props.getOptionUniqueValue( data ) ),
        };
    }

    type SelectOption<A = T> = {
        value: string;
        label: React.ReactNode;
        data: A;
    };
}

export type UniversiFormSelectInputProps<T extends Record<string, any>, Multi extends Optional<boolean>, Clear extends Optional<boolean>> = {
    options: T[];
    getOptionUniqueValue( option: T ): string | number;
    getOptionLabel( option: T ): string;
    filterOption?( option: T, search: string ): boolean;
    onUpdateOptions?( options: T[] ): Awaitable<Optional<T[]> | void>;
    sortOptions?( o1: T, o2: T ): number;

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
    onCreateOption( value: string ): Awaitable<Optional<T> | void>;
} | {
    canCreateOptions?: false;
    onCreateOption?( value: string ): Awaitable<Optional<T> | void>;
};
