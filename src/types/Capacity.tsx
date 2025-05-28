import UniversiForm from "@/components/UniversiForm";
import { type UniversiFormSelectInputProps } from "@/components/UniversiForm/inputs/UniversiFormSelectInput";
import { UniversimeApi } from "@/services";

export const MaterialTypeObjects: { [k in Capacity.Content.Type]: MaterialTypeObject } = {
    VIDEO: {
        label: "Vídeo",
    },

    LINK: {
        label: "Link",
    },

    FOLDER: {
        label: "Pasta",
    },

    FILE: {
        label: "Arquivo",
    },
}

export const MaterialTypeObjectsArray: MaterialTypeArrayObject[] = Object.entries( MaterialTypeObjects )
    .map( ([ type, data ]) => ({
        ...data,
        type: type as Capacity.Content.Type,
    }) )
    .sort( ( t1, t2 ) => t1.label.localeCompare( t2.label ) );

export function getMaterialTypeObject( type: undefined ): undefined;
export function getMaterialTypeObject( type: Capacity.Content.Type ): MaterialTypeArrayObject;
export function getMaterialTypeObject( type: Optional<Capacity.Content.Type> ): Optional<MaterialTypeArrayObject>;
export function getMaterialTypeObject( type: Optional<Capacity.Content.Type> ): Optional<MaterialTypeArrayObject> {
    return MaterialTypeObjectsArray.find( t => t.type === type );
}

export function compareContents( c1: Capacity.Folder.DTO, c2: Capacity.Folder.DTO ) {
    return c1.name.localeCompare( c2.name );
}

export function compareCategories( c1: Capacity.Category.DTO, c2: Capacity.Category.DTO ) {
    return c1.name.localeCompare( c2.name );
}

export type MaterialTypeObject = {
    label: string;
};

export type MaterialTypeArrayObject = MaterialTypeObject & {
    type: Capacity.Content.Type;
};

export function MaterialTypeSelect<C extends Optional<boolean> = undefined>( props: Readonly<MaterialTypeSelectProps<C>> ) {
    return <UniversiForm.Input.Select
        { ...props }
        options={ MaterialTypeObjectsArray }
        defaultValue={ getMaterialTypeObject( props.defaultValue ) }
        getOptionUniqueValue={ t => t.type }
        getOptionLabel={ t => t.label }
        isMultiSelection={ false }
        canCreateOptions={ false }
        onCreateOption={ undefined }
    />
}

export function CategorySelect<C extends Optional<boolean>, M extends Optional<boolean>>( props: Readonly<CategorySelectProps<C, M>> ) {
    return <UniversiForm.Input.Select
        { ...props }
        options={ [ ...props.options ].sort( compareCategories ) }
        getOptionUniqueValue={ c => c.id }
        getOptionLabel={ c => c.name }
        canCreateOptions
        onCreateOption={ async name => {
                await UniversimeApi.Capacity.Category.create( { name } );
                const res = await UniversimeApi.Capacity.Category.list();
                const options = res.body?.sort( compareCategories ) ?? [];

                props.onUpdateOptions?.( options );
                return options;
        } }
    />
}

export type MaterialTypeSelectProps<Clearable extends Optional<boolean>> = Omit<
    UniversiFormSelectInputProps<MaterialTypeArrayObject, false, Clearable>,
    "options" | "getOptionUniqueValue" | "canCreateOptions" | "getOptionLabel" | "isMultiSelection" | "onCreateOption" | "defaultValue"
> & {
    defaultValue?: Capacity.Content.Type;
};

export type CategorySelectProps<Clearable extends Optional<boolean>, Multi extends Optional<boolean>> = Omit<
    UniversiFormSelectInputProps<Capacity.Category.DTO, Multi, Clearable>,
    "getOptionUniqueValue" | "canCreateOptions" | "getOptionLabel" | "onCreateOption"
> & {
    onUpdateOptions?( options: Capacity.Category.DTO[] ): any;
};
