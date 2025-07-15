import { useContext, type ReactNode, useState, useMemo } from "react";

import BootstrapIcon from "@/components/BootstrapIcon";
import Filter from "@/components/Filter";
import ActionButton from "@/components/ActionButton";
import useRefreshComponent from "@/hooks/useRefreshComponent";
import { makeClassName } from "@/utils/tsxUtils";
import { UniversiFormContext } from "../../UniversiFormContext";
import { FieldHelp, RequiredIndicator, useInitialize } from "../../utils";

import formStyles from "../../UniversiForm.module.less";
import styles from "./UniversiFormCardSelectionInput.module.less";
import UniversiForm from "@/components/UniversiForm";
import { UniversiFormData } from "@/components/UniversiForm/UniversiFormRoot";

export function UniversiFormCardSelectionInput<T>( props: Readonly<UniversiFormCardSelectionInputProps<T>> ) {
    const context = useContext( UniversiFormContext );
    const refreshComponent = useRefreshComponent();
    const [renderFilterForm, setRenderFilterForm] = useState(false);

    const [ value, setValue ] = useState( props.defaultValue ?? [] );
    useInitialize({ props, value });

    const [ textFilter, setTextFilter ] = useState( "" );
    const filteredOptions = useMemo( () => {
        return props.options
            .filter( o => (!props.isSearchable || props.searchFilter( textFilter, o )) && (props.advancedSearchFilter?.( o ) ?? true) )
    }, [ textFilter, props.options ] );

    const isAllSelected = props.options.every( o => isSelected( o ) );

    return <fieldset className={ formStyles.fieldset }>
        <div className={ styles.legend }>
            <legend>{ props.label } <RequiredIndicator required={ props.required }/></legend>

            { props.canSelectAll !== false && <ActionButton
                name={ isAllSelected ? "Desmarcar todos" : "Marcar todos" }
                biIcon={ isAllSelected ? "x-circle" : "check-circle" }
                buttonProps={ {
                    onClick: handleSelectAll,
                    className: styles.toggle_all,
                } }
            /> }

            { props.isSearchable !== false && <Filter
                className={ styles.filter }
                setter={ setTextFilter }
                placeholderMessage={ props.searchPlaceholder ?? `Buscar por ${ props.label }` }
            /> }
            { !props.useAdvancedSearch || <button type="button" className={ styles.filter_card } id="filter-card-button" onClick={ () => setRenderFilterForm( true ) } title="Filtrar Resultados">
                <span className="bi bi-filter-circle-fill" />
            </button> }
        </div>

        { props.useAdvancedSearch && renderFilterForm &&
            <UniversiForm.Root
                    title={ props.advancedSearchFilterTitle ?? "Filtrar Resultados" }
                    callback={ handleFilter }
                    skipCancelConfirmation={true}
                    confirmButton={ { text: "Filtrar" } }
                    cancelButton={ { text: "Limpar Filtro" } } >
                { props.advancedSearchFilterOptions?.() }
            </UniversiForm.Root>
        }
        <FieldHelp>{ props.help }</FieldHelp>

        { props.options.length === 0
            ? <p className={ styles.no_result }>{ props.noOptionsText ?? "Nenhuma opção disponível" }</p>
        : filteredOptions.length === 0
            ? <p className={ styles.no_result }>{ props.searchNotFound ?? "Nenhuma opção encontrada" }</p>
        : null }

        <div className={ styles.options_list }>
            { filteredOptions.map( option => <div className={ styles.option } key={ props.getOptionUniqueValue( option ) }>
                { props.render( option ) }
                <button type="button" onClick={ () => handleToggle( option ) } className={ makeClassName( styles.check, isSelected( option ) && styles.selected ) }>
                    <BootstrapIcon icon={ isSelected( option ) ? "check-circle" : "circle" }/>
                </button>
            </div> ) }
        </div>
    </fieldset>

    function handleFilter( filterForm: UniversiFormData<Record<string, any>> ):any {
        setRenderFilterForm( false );
        props.handleAdvancedSearch?.( filterForm );
        refreshComponent();
    }

    function isSelected( option: T ): boolean {
        return undefined !== value.find( v => props.getOptionUniqueValue( v ) === props.getOptionUniqueValue( option ) );
    }

    async function changeValue( newValue: T[] ) {
        setValue( newValue );
        await context?.set( props.param, newValue );
        await props.onChange?.( newValue );
    }

    async function handleToggle( option: T ) {
        const newValue = isSelected( option )
            ? value.filter( v => props.getOptionUniqueValue( v ) !== props.getOptionUniqueValue( option ) )
            : [ ...value, option ];

        changeValue( newValue );
    }

    function handleSelectAll() {
        changeValue( isAllSelected ? [] : props.options );
    }
}

export type UniversiFormCardSelectionInputProps<T> = {
    options: T[];
    defaultValue?: T[];
    getOptionUniqueValue( option: T ): string | number;
    render( option: T ): NonNullable<ReactNode>;
    canSelectAll?: boolean;

    searchPlaceholder?: string;
    searchNotFound?: string;

    noOptionsText?: string;
} & UniversiFormFieldProps<T[]>
& SearchOptions<T>;

type SearchOptions<T> = {
    isSearchable: true;
    searchFilter( text: string, option: T ): boolean;

    useAdvancedSearch?: false | true;
    advancedSearchFilterTitle?: string;
    advancedSearchFilter?( option: T ): boolean;
    advancedSearchFilterOptions?(): ReactNode[];
    handleAdvancedSearch?( form: UniversiFormData<Record<string, any>> ): void;
} | {
    isSearchable?: false;
    searchFilter?( text: string, option: T ): boolean;

    useAdvancedSearch?: false;
    advancedSearchFilterTitle?: string;
    advancedSearchFilter?( option: T ): boolean;
    advancedSearchFilterOptions?(): ReactNode[];
    handleAdvancedSearch?( form : UniversiFormData<Record<string, any>> ): void;
}
