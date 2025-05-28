import { useContext, type ReactNode, useState, useMemo } from "react";

import BootstrapIcon from "@/components/BootstrapIcon";
import Filter from "@/components/Filter";
import useRefreshComponent from "@/hooks/useRefreshComponent";
import { ArrayChanges } from "@/utils/arrayUtils";
import { UniversiFormContext } from "../../UniversiFormContext";
import { RequiredIndicator, useInitialize } from "../../utils";

import formStyles from "../../UniversiForm.module.less";
import styles from "./UniversiFormCardSelectionInput.module.less";


export function UniversiFormCardSelectionInput<T, S extends Optional<boolean>>( props: Readonly<UniversiFormCardSelectionInputProps<T, S>> ) {
    const context = useContext( UniversiFormContext );
    const refreshComponent = useRefreshComponent();

    const changes = useMemo( () => {
        return new ArrayChanges(
            props.defaultValue ?? [],
            ( o1, o2 ) => props.getOptionUniqueValue( o1 ) === props.getOptionUniqueValue( o2 ),
        );
    }, [ props.options, props.defaultValue ] );

    useInitialize({ props, value: getFinalValue() });

    const [ textFilter, setTextFilter ] = useState( "" );
    const filteredOptions = useMemo( () => {
        return props.options
            .filter( o => !props.isSearchable || props.searchFilter( textFilter, o ) );
    }, [ textFilter, props.options ] );

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
                    <BootstrapIcon icon={ changes.inFinal( option ) ? "check-circle-fill" : "check-circle" }/>
                </button>
            </div> ) }
        </div>
    </fieldset>

    function getFinalValue(): UniversiFormCardSelectionInputValue<T, S> {
        if ( props.isSeparate === true )
            return {
                added: changes.added,
                removed: changes.removed,
            } as UniversiFormCardSelectionInputValue<T, S>;

        else
            return changes.final() as UniversiFormCardSelectionInputValue<T, S>;
    }

    function handleToggle( option: T ) {
        if ( changes.inFinal( option ) )
            changes.remove( option );
        else
            changes.add( option );

        const val = getFinalValue();

        context?.set( props.param, val ).then( () => {
            props.onChange?.( val );
        } );

        refreshComponent();
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
    added: T[];
    removed: T[];
};

type SearchOptions<T> = {
    isSearchable: true;
    searchFilter( text: string, option: T ): boolean;
} | {
    isSearchable?: false;
    searchFilter?( text: string, option: T ): boolean;
}
