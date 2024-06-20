import { useMemo, useState } from "react";
import Select, { GroupBase, StylesConfig } from "react-select"
import CreatableSelect from "react-select/creatable"

import { UniversiFormCustomField, UniversiFormFieldProps } from "../UniversiFormCustomField";
import { PossiblePromise } from "@/types/utils";

export function SelectSingle<Object>( props : Readonly<SelectSingleProps<Object>> ) {
    const [object, setObject] = useState<Object | undefined>(props.defaultObject);
    const [available, setAvailable] = useState<Object[]>(props.options);

    const selectParams = useMemo(() => ({
        isClearable: true,
        menuPosition: "fixed" as const,

        placeholder: props.placeholder ?? "Selecione",
        options: available,
        required: props.required,
        getOptionLabel: props.getLabel,
        getOptionValue: props.getValue,
        styles: props.stylesConfig,

        onChange: handleChange,
        noOptionsMessage: handleNotFound,
    }), [props, available]);

    const canCreate = props.createValue !== undefined;

    return <UniversiFormCustomField {...props} getValue={ handleGetValue }>
        { canCreate
            ? <CreatableSelect {...selectParams} formatCreateLabel={(value) => `Criar "${value}"`} onCreateOption={handleCreate} />
            : <Select {...selectParams} />
        }
    </UniversiFormCustomField>

    function handleGetValue() {
        if ( object === undefined )
            return undefined;

        return props.getValue?.(object) ?? object;
    }

    function handleChange(obj: Object | null) {
        const newValue = obj ?? undefined;

        props.onChange?.(newValue);
        setObject(newValue);
    }

    function handleNotFound(input: { inputValue: string }) {
        return props.noOptionFound?.(input.inputValue) ?? "Nenhuma opção encontrada";
    }

    async function handleCreate(input: string ) {
        const res = await props.createValue?.( input );

        if (!res) return;

        handleChange(res.createdObject);

        if (res.newOptions)
            setAvailable(res.newOptions)

        else setAvailable( a => {
            a.push(res.createdObject);
            return a;
        });
    }
}

export type SelectSingleProps<O> = UniversiFormFieldProps<O> & {
    options: O[];
    getLabel: (obj: O) => string;

    createValue?: (value: string) => PossiblePromise<{
        createdObject: O;
        newOptions?: O[];
    } | undefined>;

    placeholder?: string;
    noOptionFound?: (input: string) => string;

    stylesConfig?: StylesConfig<O, false, GroupBase<O>>;
};
