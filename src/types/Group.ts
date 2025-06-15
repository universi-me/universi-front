export const GroupEmailFilterTypeToLabel = {
    "END_WITH":     "Terminando em",
    "START_WITH":   "Começando com",
    "CONTAINS":     "Contendo",
    "EQUALS":       "Igual a",
    "MASK":         "Máscara ( * )",
    "REGEX":        "Padrão RegEx",
};

export const GroupTypeObjects: { [ t in Group.Type ]: GroupTypeObject } = {
    INSTITUTION: {
        label: "Instituição",
    },

    CAMPUS: {
        label: "Campus",
    },

    COURSE: {
        label: "Curso",
    },

    PROJECT: {
        label: "Projeto",
    },

    CLASSROOM: {
        label: "Sala de Aula",
    },

    MONITORIA: {
        label: "Monitoria",
    },

    LABORATORY: {
        label: "Laboratório",
    },

    ACADEMIC_CENTER: {
        label: "Centro Acadêmico",
    },

    DEPARTMENT: {
        label: "Departamento",
    },

    STUDY_GROUP: {
        label: "Grupo de Estudos",
    },

    GROUP_GENERAL: {
        label: "Grupo Geral",
    },

    DIRECTORATE: {
        label: "Diretoria",
    },

    MANAGEMENT: {
        label: "Gerência",
    },

    COORDINATION: {
        label: "Coordenação",
    },

    COMPANY_AREA: {
        label: "Área da Empresa",
    },

    DEVELOPMENT_TEAM: {
        label: "Time de Desenvolvimento",
    },

    INTEREST_GROUP: {
        label: "Grupo de Interesse",
    },

    MISCELLANEOUS_SUBJECTS: {
        label: "Assuntos Diversos",
    },

    ENTERTAINMENT: {
        label: "Entretenimento",
    },
};

export const GroupTypeObjectsArray: GroupTypeArrayObject[] = Object.entries( GroupTypeObjects )
    .map( ( [ type, data ] ) => ({
        ...data,
        type: type as Group.Type,
    }) );

export function getGroupTypeObject( type: undefined ): undefined;
export function getGroupTypeObject( type: Group.Type ): GroupTypeArrayObject;
export function getGroupTypeObject( type: Optional<Group.Type> ): Optional<GroupTypeArrayObject>;
export function getGroupTypeObject( type: Optional<Group.Type> ): Optional<GroupTypeArrayObject> {
    return GroupTypeObjectsArray.find( l => l.type === type );
}

export type GroupTypeObject = {
    label: string;
};

export type GroupTypeArrayObject = GroupTypeObject & {
    type: Group.Type;
};
