import { useContext, useEffect, type ReactNode, useState, useMemo } from "react";

import BootstrapIcon from "@/components/BootstrapIcon";
import Filter from "@/components/Filter";
import { UniversiFormContext } from "../../UniversiFormContext";
import { RequiredIndicator } from "../../utils";

import formStyles from "../../UniversiForm.module.less";
import styles from "./UniversiFormCardSelectionInput.module.less";


export function UniversiFormCardSelectionInput<T, S extends Optional<boolean>>( props: Readonly<UniversiFormCardSelectionInputProps<T, S>> ) {
    const context = useContext( UniversiFormContext );
    const [ changes, setChanges ] = useState<SelectionChanges<T>>( { add: [], remove: [] } );
    useEffect(
        () => context?.initialize( props.param, changes, { functions: props.validations, required: props.required } ),
        [ props.required, props.validations ]
    );

    const [ textFilter, setTextFilter ] = useState( "" );
    const filteredOptions = useMemo( () => {
        return props.options
            .filter( o => !props.isSearchable || props.searchFilter( textFilter, o ) );
    }, [ textFilter, props.options ] );

    useEffect( () => {
        const val = getFinalValue();

        context?.set( props.param, val ).then( () => {
            props.onChange?.( val );
        } );
    }, [ changes.add, changes.remove ] );

    return <fieldset className={ formStyles.fieldset }>
        <div className={ styles.legend }>
            <legend>{ props.label } <RequiredIndicator required={ props.required }/></legend>
            { props.isSearchable !== false && <Filter
                className={ styles.filter }
                setter={ setTextFilter }
                placeholderMessage={ props.searchPlaceholder ?? `Buscar por ${ props.label }` }
            /> }
        </div>

        { props.options.length === 0
            ? <p className={ styles.no_result }>{ props.noOptionsText ?? "Nenhuma opção disponível" }</p>
        : filteredOptions.length === 0
            ? <p className={ styles.no_result }>{ props.searchNotFound ?? "Nenhuma opção encontrada" }</p>
        : null }

        <div className={ styles.options_list }>
            { filteredOptions.map( option => <div className={ styles.option } key={ props.getOptionUniqueValue( option ) }>
                { props.render( option ) }
                <button type="button" onClick={ () => handleToggle( option ) } className={ styles.check }>
                    <BootstrapIcon icon={ isSelected( option ) ? "check-circle-fill" : "check-circle" }/>
                </button>
            </div> ) }
        </div>
    </fieldset>

    function isOptionInArray( arr: Optional<T[]>, option: T ): boolean {
        const optionValue = props.getOptionUniqueValue( option );
        return undefined !== ( arr ?? [] ).find( o => props.getOptionUniqueValue( o ) === optionValue );
    }

    function isSelected( option: T ): boolean {
        return ( isOptionInArray( changes.add, option ) )
            || ( isOptionInArray( props.defaultValue, option ) && !isOptionInArray( changes.remove, option ) );
    }

    function getFinalValue(): UniversiFormCardSelectionInputValue<T, S> {
        if ( props.isSeparate === true )
            return {
                add: [ ...changes.add ],
                remove: [ ...changes.remove ],
            } as UniversiFormCardSelectionInputValue<T, S>;

        else
            return ( props.defaultValue ?? [] )
                .filter( o => !isOptionInArray( changes.remove, o ) )
                .concat( changes.add ) as UniversiFormCardSelectionInputValue<T, S>;
    }

    function handleToggle( option: T ) {
        const optionValue = props.getOptionUniqueValue( option );
        const inDefault = isOptionInArray( props.defaultValue, option );

        if ( isSelected( option ) ) { // remove
            setChanges( changes => ({
                add: changes.add.filter( o => props.getOptionUniqueValue( o ) !== optionValue ),
                remove: inDefault
                    ? [ ...changes.remove, option ]
                    : changes.remove.filter( o => props.getOptionUniqueValue( o ) !== optionValue )
            }) );
        }

        else { // add
            setChanges( changes => ({
                remove: changes.remove.filter( o => props.getOptionUniqueValue( o ) !== optionValue ),
                add: inDefault
                    ? [ ...changes.add ]
                    : [ ...changes.add, option ],
            }) );
        }
    }
}

export type UniversiFormCardSelectionInputProps<T, Separate extends Optional<boolean>> = {
    options: T[];
    defaultValue?: T[];
    getOptionUniqueValue( option: T ): string | number;
    render( option: T ): NonNullable<ReactNode>;

    isSeparate?: Separate;

    searchPlaceholder?: string;
    searchNotFound?: string;

    noOptionsText?: string;
} & Omit<UniversiFormFieldProps<UniversiFormCardSelectionInputValue<T, Separate>>, "defaultValue">
& SearchOptions<T>;

export type UniversiFormCardSelectionInputValue<T, S extends Optional<boolean>> = S extends true
    ? SelectionChanges<T>
    : T[];

type SelectionChanges<T> = {
    add: T[];
    remove: T[];
};

type SearchOptions<T> = {
    isSearchable: true;
    searchFilter( text: string, option: T ): boolean;
} | {
    isSearchable?: false;
    searchFilter?( text: string, option: T ): boolean;
}
