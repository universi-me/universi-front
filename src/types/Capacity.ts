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
    }) );

export function getMaterialTypeObject( type: undefined ): undefined;
export function getMaterialTypeObject( type: Capacity.Content.Type ): MaterialTypeArrayObject;
export function getMaterialTypeObject( type: Optional<Capacity.Content.Type> ): Optional<MaterialTypeArrayObject>;
export function getMaterialTypeObject( type: Optional<Capacity.Content.Type> ): Optional<MaterialTypeArrayObject> {
    return MaterialTypeObjectsArray.find( t => t.type === type );
}

export function compareContents( c1: Capacity.Folder.DTO, c2: Capacity.Folder.DTO ) {
    return c1.name.localeCompare( c2.name );
}

export type MaterialTypeObject = {
    label: string;
};

export type MaterialTypeArrayObject = MaterialTypeObject & {
    type: Capacity.Content.Type;
};
