
export enum Permission {
    DEFAULT = 4,
    NONE = 0,
    DISABLED = 1,
    READ = 2,
    READ_WRITE = 3,
    READ_WRITE_DELETE = 4,
}



export type FeatureTypes = "FEED" | "CONTENT" | "GROUP" | "PEOPLE" | "COMPETENCE";

export const FeatureTypesToLabel = {
    "FEED":         "Publicações",
    "CONTENT":      "Conteúdo",
    "GROUP":        "Grupo",
    "PEOPLE":       "Pessoas",
    "COMPETENCE":   "Competência"
};

export type Roles = {
    id: string;
    name: string;
    description : string;
    isDefault: boolean;
    rolesFeatures: RolesFeature[];
    features?: RolesFeature[];
}

export type RolesFeature = {
    id: string;
    roles: string;
    featureType: FeatureTypes;
    permission: number;
}

export type RolesProfile = {
    id: string;
    roles: Roles;
}