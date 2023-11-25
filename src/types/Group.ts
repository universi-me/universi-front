import type { Profile } from "@/types/Profile";

export type Group = {
    id:                string;
    name:              string;
    description:       string;
    admin:             Profile;
    type:              GroupType;
    nickname:          string;
    path:              string;
    image:             string | null;
    createdAt:         string;
    canAddParticipant: boolean;
    canCreateGroup:    boolean;
    canEnter:          boolean;
    publicGroup:       boolean;
    rootGroup:         boolean;
    bannerImage:       string | null;
    organization:      Group | null;
};

export type GroupEmailFilter = {
    id:      string;
    enabled: boolean;
    type:    GroupEmailFilterType;
    email:   string;
    added:   string;
};

export type GroupEmailFilterType = "END_WITH" | "START_WITH" | "CONTAINS" | "EQUALS" | "MASK" | "REGEX";

export const GroupEmailFilterTypeToLabel = {
    "END_WITH":     "Terminando em",
    "START_WITH":   "Começando com",
    "CONTAINS":     "Contendo",
    "EQUALS":       "Igual a",
    "MASK":         "Máscara ( * )",
    "REGEX":        "Padrão RegEx",
};

export type GroupType = "INSTITUTION" | "CAMPUS" | "COURSE" | "PROJECT" | "CLASSROOM" | "MONITORIA" | "LABORATORY"
                      | "ACADEMIC_CENTER" | "DEPARTMENT" | "STUDY_GROUP";

export const GroupTypeToLabel = {
    "INSTITUTION":     "Instituição",
    "CAMPUS":          "Campus",
    "COURSE":          "Curso",
    "PROJECT":         "Projeto",
    "CLASSROOM":       "Sala de Aula",
    "MONITORIA":       "Monitoria",
    "LABORATORY":      "Laboratório",
    "ACADEMIC_CENTER": "Centro Acadêmico",
    "DEPARTMENT":      "Departamento",
    "STUDY_GROUP":     "Grupo de Estudo",
};
