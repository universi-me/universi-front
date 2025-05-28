import UniversiForm from "@/components/UniversiForm";
import { UniversiFormSelectInputProps } from "@/components/UniversiForm/inputs/UniversiFormSelectInput";
import { UniversimeApi } from "@/services";

export function compareInstitutions( c1: Institution.DTO, c2: Institution.DTO ) {
    return c1.name.localeCompare( c2.name );
}

export function InstitutionSelect<C extends Optional<boolean>>( props: Readonly<InstitutionSelectProps<C>> ) {
    return <UniversiForm.Input.Select
            { ...props }
            options={ [ ...props.options ].sort( compareInstitutions ) }
            getOptionLabel={ c => c.name }
            getOptionUniqueValue={ c => c.id }
            canCreateOptions
            onCreateOption={ async name => {
                await UniversimeApi.Institution.create( { name } );
                const res = await UniversimeApi.Institution.list();
                const options = res.body?.sort( compareInstitutions ) ?? [];

                props.onUpdateOptions?.( options );
                return options;
            } }
            createOptionLabel={ props.createOptionLabel ?? ( name => `Criar Tipo de Competência "${ name }"` ) }
        />
}

export type InstitutionSelectProps<Clearable extends Optional<boolean>> = Omit<
    UniversiFormSelectInputProps<Institution.DTO, false, Clearable>,
    "getOptionUniqueValue" | "canCreateOptions" | "getOptionLabel" | "onCreateOption"
> & {
    onUpdateOptions?( options: Institution.DTO[] ): any;
};
