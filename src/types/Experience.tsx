import { UniversiFormSelectInput, UniversiFormSelectInputProps } from "@/components/UniversiForm/inputs/UniversiFormSelectInput";
import { UniversimeApi } from "@/services";

export function compareExperienceTypes( c1: Experience.Type, c2: Experience.Type ) {
    return c1.name.localeCompare( c2.name );
}

export function ExperienceTypeSelect<C extends Optional<boolean>>( props: Readonly<ExperienceTypeSelectProps<C>> ) {
    return <UniversiFormSelectInput
            { ...props }
            options={ [ ...props.options ].sort( compareExperienceTypes ) }
            getOptionLabel={ c => c.name }
            getOptionUniqueValue={ c => c.id }
            canCreateOptions
            onCreateOption={ async name => {
                await UniversimeApi.ExperienceType.create( { name } );
                const res = await UniversimeApi.ExperienceType.list();
                const options = res.body?.sort( compareExperienceTypes ) ?? [];

                props.onUpdateOptions?.( options );
                return options;
            } }
            createOptionLabel={ props.createOptionLabel ?? ( name => `Criar Tipo de Competência "${ name }"` ) }
        />
}

export type ExperienceTypeSelectProps<Clearable extends Optional<boolean>> = Omit<
    UniversiFormSelectInputProps<Experience.Type, false, Clearable>,
    "getOptionUniqueValue" | "canCreateOptions" | "getOptionLabel" | "onCreateOption"
> & {
    onUpdateOptions?( options: Experience.Type[] ): any;
};
