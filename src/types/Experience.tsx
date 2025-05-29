import { UniversiFormSelectInput, UniversiFormSelectInputProps } from "@/components/UniversiForm/inputs/UniversiFormSelectInput";
import { UniversimeApi } from "@/services";

export function compareExperienceTypes( c1: Experience.Type, c2: Experience.Type ) {
    return c1.name.localeCompare( c2.name );
}

export function ExperienceTypeSelect<C extends Optional<boolean>>( props: Readonly<ExperienceTypeSelectProps<C>> ) {
    return <UniversiFormSelectInput
        { ...props }
        options={ props.options }
        getOptionLabel={ c => c.name }
        getOptionUniqueValue={ c => c.id }
        sortOptions={ compareExperienceTypes }
        canCreateOptions
        onCreateOption={ async name => {
            const res = await UniversimeApi.ExperienceType.create( { name } );
            return res.body;
        } }
        createOptionLabel={ props.createOptionLabel ?? ( name => `Criar Tipo de Competência "${ name }"` ) }
    />
}

export type ExperienceTypeSelectProps<Clearable extends Optional<boolean>> = Omit<
    UniversiFormSelectInputProps<Experience.Type, false, Clearable>,
    "getOptionUniqueValue" | "canCreateOptions" | "getOptionLabel" | "onCreateOption" | "sortOptions"
>;
