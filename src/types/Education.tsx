import UniversiForm from "@/components/UniversiForm";
import { UniversiFormSelectInputProps } from "@/components/UniversiForm/inputs/UniversiFormSelectInput";
import { UniversimeApi } from "@/services";


export function compareEducationTypes( et1: Education.Type, et2: Education.Type ) {
    return et1.name.localeCompare( et2.name );
}

export function EducationTypeSelect<C extends Optional<boolean>>( props: Readonly<EducationTypeSelectProps<C>> ) {
    return <UniversiForm.Input.Select
        { ...props }
        options={ props.options }
        sortOptions={ compareEducationTypes }
        getOptionLabel={ c => c.name }
        getOptionUniqueValue={ c => c.id }
        canCreateOptions
        onCreateOption={ async name => {
            const res = await UniversimeApi.EducationType.create( { name } );
            return res.body;
        } }
        createOptionLabel={ props.createOptionLabel ?? ( name => `Criar Tipo de Competência "${ name }"` ) }
    />
}

export type EducationTypeSelectProps<Clearable extends Optional<boolean>> = Omit<
    UniversiFormSelectInputProps<Education.Type, false, Clearable>,
    "getOptionUniqueValue" | "canCreateOptions" | "getOptionLabel" | "onCreateOption" | "sortOptions"
>;
