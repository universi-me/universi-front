import UniversiForm from "@/components/UniversiForm2";
import { UniversiFormSelectInputProps } from "@/components/UniversiForm2/inputs/UniversiFormSelectInput";

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
    }) );

export function getCompetenceLevelObject( level: undefined ): undefined;
export function getCompetenceLevelObject( level: Competence.Level ): CompetenceLevelArrayObject;
export function getCompetenceLevelObject( level: Optional<Competence.Level> ): Optional<CompetenceLevelArrayObject>;
export function getCompetenceLevelObject( level: Optional<Competence.Level> ): Optional<CompetenceLevelArrayObject> {
    return CompetenceLevelObjectsArray.find( l => l.level === level );
}

export function compareCompetenceTypes( c1: Competence.Type, c2: Competence.Type ): number {
    return c1.name.localeCompare( c2.name );
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

export type CompetenceLevelSelectProps<Clearable extends Optional<boolean>> = Omit<
    UniversiFormSelectInputProps<CompetenceLevelArrayObject, false, Clearable>,
    "options" | "getOptionUniqueValue" | "canCreateOptions" | "getOptionLabel" | "isMultiSelection" | "onCreateOption" | "defaultValue"
> & {
    defaultValue?: Competence.Level;
};
