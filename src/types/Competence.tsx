import useCache from "@/contexts/Cache";
import UniversiForm from "@/components/UniversiForm";
import { UniversiFormSelectInputProps } from "@/components/UniversiForm/inputs/UniversiFormSelectInput";
import { UniversimeApi } from "@/services";

export function intToLevel(int: number): Competence.Level {
    return int % 4 as Competence.Level;
}

export function strToLevel( str: string ): Competence.Level {
    return intToLevel( parseInt( str ) );
}

export const CompetenceLevelObjects: { [l in Competence.Level]: CompetenceLevelObject } = {
    0: {
        label: "📚 Aprendiz",
        description: "Você está aprendendo a tecnologia. Sabe fazer exemplos básicos e segue tutoriais.",
    },

    1: {
        label: "🌱 Iniciante",
        description: "Você já consegue fazer projetos simples, mas não entende de aspectos mais complexos.",
    },

    2: {
        label: "🛠️ Intermediário",
        description: "Você consegue fazer projetos complexos, sem precisar ficar consultando questões básicas. Você consegue ensinar pessoas iniciantes.",
    },

    3: {
        label: "💪 Experiente",
        description: "Você consegue fazer projetos complexos e atuar em melhorias sobre a tecnologia. Consegue explorar aspectos profundos sobre este conhecimento. Você consegue ensinar pessoas com nível intermediário.",
    },
};

export const CompetenceLevelObjectsArray: CompetenceLevelArrayObject[] = Object.entries( CompetenceLevelObjects )
    .map( ( [ level, data ] ) => ({
        ...data,
        level: strToLevel( level ),
    }) )
    .sort( ( l1, l2 ) => l1.level - l2.level );

export function getCompetenceLevelObject( level: undefined ): undefined;
export function getCompetenceLevelObject( level: Competence.Level ): CompetenceLevelArrayObject;
export function getCompetenceLevelObject( level: Optional<Competence.Level> ): Optional<CompetenceLevelArrayObject>;
export function getCompetenceLevelObject( level: Optional<Competence.Level> ): Optional<CompetenceLevelArrayObject> {
    return CompetenceLevelObjectsArray.find( l => l.level === level );
}

export function compareCompetenceTypes( c1: Competence.Type, c2: Competence.Type ): number {
    return c1.name.localeCompare( c2.name );
}

export function compareCompetences( c1: Competence.DTO, c2: Competence.DTO ): number {
    return compareCompetenceTypes( c1.competenceType, c2.competenceType )
        || c1.level - c2.level
        || new Date( c1.creationDate ).getTime() - new Date( c2.creationDate).getTime() ;
}

export type CompetenceLevelObject = {
    description: string;
    label: string;
};

export type CompetenceLevelArrayObject = CompetenceLevelObject & {
    level: Competence.Level;
};

export function CompetenceLevelSelect<C extends Optional<boolean> = undefined>( props: Readonly<CompetenceLevelSelectProps<C>> ) {
    return <UniversiForm.Input.Select
        { ...props }
        options={ CompetenceLevelObjectsArray }
        defaultValue={ getCompetenceLevelObject( props.defaultValue ) }
        getOptionUniqueValue={ t => t.level }
        getOptionLabel={ t => t.label }
        isMultiSelection={ false }
        canCreateOptions={ false }
        onCreateOption={ undefined }
    />
}

export function CompetenceTypeSelect<C extends Optional<boolean>, M extends Optional<boolean>>( props: Readonly<CompetenceTypeSelectProps<C, M>> ) {
    const cache = useCache();

    return <UniversiForm.Input.Select
        { ...props }
        options={ props.options }
        getOptionLabel={ c => c.name }
        getOptionUniqueValue={ c => c.id }
        canCreateOptions
        sortOptions={ compareCompetenceTypes }
        onCreateOption={ async name => {
            const res = await UniversimeApi.CompetenceType.create( { name } );
            await cache.CompetenceType.update();
            return res.body;
        } }
        createOptionLabel={ props.createOptionLabel ?? ( name => `Criar Tipo de Competência "${ name }"` ) }
    />
}

export type CompetenceLevelSelectProps<Clearable extends Optional<boolean>> = Omit<
    UniversiFormSelectInputProps<CompetenceLevelArrayObject, false, Clearable>,
    "options" | "getOptionUniqueValue" | "canCreateOptions" | "getOptionLabel" | "isMultiSelection" | "onCreateOption" | "defaultValue"
> & {
    defaultValue?: Competence.Level;
};

export type CompetenceTypeSelectProps<Clearable extends Optional<boolean>, Multi extends Optional<boolean>> = Omit<
    UniversiFormSelectInputProps<Competence.Type, Multi, Clearable>,
    "getOptionUniqueValue" | "canCreateOptions" | "getOptionLabel" | "onCreateOption" | "sortOptions"
>;
