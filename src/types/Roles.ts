
export enum Permission {
    NONE = 0,
    DISABLED = 1,
    READ = 2,
    READ_WRITE = 3,
    READ_WRITE_DELETE = 4,
    DEFAULT = READ_WRITE_DELETE,
}

export const FeatureTypesToLabel: { [k in Role.Feature]: string } = {
    "FEED":         "Publicações",
    "CONTENT":      "Conteúdo",
    "GROUP":        "Grupo",
    "PEOPLE":       "Pessoas",
    "COMPETENCE":   "Competência",
    "JOBS":         "Vagas",
};
