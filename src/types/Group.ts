import type { Profile } from "@/types/Profile";

export type Group = {
    id:           number;
    name:         string;
    description:  string;
    admin:        Profile;
    participants: Profile[];
    type:         GroupType;
    nickname:     string;
    subgroups:    Group[];
    image:        string;
    createdAt:    string;
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
