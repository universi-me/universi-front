import { UniversiFormSelectInput, UniversiFormSelectInputProps } from "@/components/UniversiForm/inputs/UniversiFormSelectInput";
import { stringIncludesIgnoreCase } from "@/utils/stringUtils";

export const GroupEmailFilterTypeToLabel = {
    "END_WITH":     "Terminando em",
    "START_WITH":   "Começando com",
    "CONTAINS":     "Contendo",
    "EQUALS":       "Igual a",
    "MASK":         "Máscara ( * )",
    "REGEX":        "Padrão RegEx",
};

export function compareGroupTypes( gt1: Group.Type, gt2: Group.Type ): number {
    return gt1.label.localeCompare( gt2.label );
}

export function GroupTypeSelect<C extends Optional<boolean>>( props: Readonly<GroupTypeSelectProps<C>> ) {
    return <UniversiFormSelectInput
        isSearchable
        { ...props }
        getOptionUniqueValue={ o => o.id }
        getOptionLabel={ o => o.label }
        canCreateOptions={ false }
        sortOptions={ compareGroupTypes }
        filterOption={ ( gt, s ) => gt.canBeAssigned && stringIncludesIgnoreCase( gt.label, s ) }
    />
}

export type GroupTypeSelectProps<Clearable extends Optional<boolean>> = Omit<
    UniversiFormSelectInputProps<Group.Type, false, Clearable>,
    "canCreateOptions" | "getOptionUniqueValue" | "getOptionLabel" | "sortOptions" | "filterOption"
>
