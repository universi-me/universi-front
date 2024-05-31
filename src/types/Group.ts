import type { Profile } from "@/types/Profile";
import type { FeatureTypes } from "@/types/Roles";

export type Group = {
    id:                string;
    name:              string;
    description:       string;
    admin:             Profile;
    administrators?:   Profile[];
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
    headerImage:       string | null;
    organization:      Group | null;
    canEdit:           boolean;
    everyoneCanPost:   boolean;

    permissions: {
        [k in FeatureTypes]: number;
    }
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

export type GroupTheme ={
    id:                     string;
    primaryColor:           string;
    secondaryColor:         string;
    tertiaryColor:          string;
    backgroundColor:        string;
    cardBackgroundColor:    string;
    cardItemColor:          string;
    fontColorV1:            string;
    fontColorV2:            string;
    fontColorV3:            string;
    fontColorV4:            string;
    fontColorV5:            string;
    fontColorV6:            string;
    fontDisabledColor:      string;
    formsColor:             string;
    skills1Color:           string;
    waveColor:              string;
    buttonYellowHoverColor: string;
    buttonHoverColor:       string;
    alertColor:             string;
    successColor:           string;
    wrongInvalidColor:      string;
    rankColor:              string;
};

export type GroupType = "INSTITUTION" | "CAMPUS" | "COURSE" | "PROJECT" | "CLASSROOM" | "MONITORIA" | "LABORATORY"
                      | "ACADEMIC_CENTER" | "DEPARTMENT" | "STUDY_GROUP" | "GROUP_GENERAL" | "DIRECTORATE" | "MANAGEMENT" 
                      | "COORDINATION" | "COMPANY_AREA" | "DEVELOPMENT_TEAM" | "INTEREST_GROUP" | "MISCELLANEOUS_SUBJECTS" | "ENTERTAINMENT";

export const GroupTypeToLabel: { [k in GroupType]: string } = {
    "INSTITUTION":     "Instituição",
    "CAMPUS":          "Campus",
    "COURSE":          "Curso",
    "PROJECT":         "Projeto",
    "CLASSROOM":       "Sala de Aula",
    "MONITORIA":       "Monitoria",
    "LABORATORY":      "Laboratório",
    "ACADEMIC_CENTER": "Centro Acadêmico",
    "DEPARTMENT":      "Departamento",
    "STUDY_GROUP":     "Grupo de Estudos",
    "GROUP_GENERAL": "Grupo Geral",
    "DIRECTORATE": "Diretoria",
    "MANAGEMENT": "Gerência",
    "COORDINATION": "Coordenação",
    "COMPANY_AREA": "Área da Empresa",
    "DEVELOPMENT_TEAM": "Time de Desenvolvimento",
    "INTEREST_GROUP": "Grupo de Interesse",
    "MISCELLANEOUS_SUBJECTS": "Assuntos Diversos",
    "ENTERTAINMENT": "Entretenimento",
};
