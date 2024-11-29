
export enum Permission {
    NONE = 0,
    DISABLED = 1,
    READ = 2,
    READ_WRITE = 3,
    READ_WRITE_DELETE = 4,
    DEFAULT = READ_WRITE_DELETE,
}

export type RoleType = "ADMINISTRATOR" | "PARTICIPANT" | "VISITOR" | "CUSTOM";

export type FeatureTypes = "FEED" | "CONTENT" | "GROUP" | "PEOPLE" | "COMPETENCE" | "JOBS";

export const FeatureTypesToLabel: { [k in FeatureTypes]: string } = {
    "FEED":         "Publicações",
    "CONTENT":      "Conteúdo",
    "GROUP":        "Grupo",
    "PEOPLE":       "Pessoas",
    "COMPETENCE":   "Competência",
    "JOBS":         "Vagas",
};

export type Roles = {
    id: string;
    name: string;
    description: string;
    created: string;
    roleType: RoleType;

    canBeEdited: boolean;
    canBeAssigned: boolean;

    permissions: {
        [k in FeatureTypes]: number;
    }
}

export type RolesProfile = {
    id: string;
    roles: Roles;
}
