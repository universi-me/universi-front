
export enum Permission {
    NONE = 0,
    DISABLED = 1,
    READ = 2,
    READ_WRITE = 3,
    READ_WRITE_DELETE = 4,
    DEFAULT = READ_WRITE_DELETE,
}



export type FeatureTypes = "FEED" | "CONTENT" | "GROUP" | "PEOPLE" | "COMPETENCE";

export const FeatureTypesToLabel: { [k in FeatureTypes]: string } = {
    "FEED":         "Publicações",
    "CONTENT":      "Conteúdo",
    "GROUP":        "Grupo",
    "PEOPLE":       "Pessoas",
    "COMPETENCE":   "Competência"
};

export type RoleDTO = {
    id: string;
    name: string;

    profile: string;
    group: string | null;
    features: RolesFeature[];
}

export type Roles = {
    id: string;
    name: string;
    description: string;
    created: string;
    rolesFeatures: RolesFeature[]
    isDefault?: boolean;
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