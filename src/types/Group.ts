import type { Profile } from "@/types/Profile";
import type { FeatureTypes } from "@/types/Roles";
import { Nullable } from "./utils";

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
    buildHash?: string;

    groupSettings: {
        theme: Nullable<GroupTheme>;
        environment: Nullable<{
            [k in keyof GroupEnvironment]?: GroupEnvironment[k];
        }>;
    };

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

export const GroupThemeToLabel: Record<keyof GroupTheme, string> = {
    // TODO: Name all variables
    primaryColor:           "Cor primária",
    secondaryColor:         "Cor secundária",
    tertiaryColor:          "Cor terciária",
    backgroundColor:        "Cor de fundo",
    cardBackgroundColor:    "Cor de fundo de cartões",
    cardItemColor:          "Cor de de itens de cartões",
    fontColorV1:            "Cor de fonte 1",
    fontColorV2:            "Cor de fonte 2",
    fontColorV3:            "Cor de fonte 3",
    fontColorV4:            "Cor de fonte 4",
    fontColorV5:            "Cor de fonte 5",
    fontColorV6:            "Cor de fonte 6",
    fontDisabledColor:      "Cor de fonte desabilitada",
    formsColor:             "Cor de formulários",
    skills1Color:           "Cor de habilidades",
    waveColor:              "Cor da onda",
    buttonYellowHoverColor: "buttonYellowHoverColor",
    buttonHoverColor:       "buttonHoverColor",
    alertColor:             "Cor de alerta",
    successColor:           "Cor de sucesso",
    wrongInvalidColor:      "Cor de erro",
    rankColor:              "rankColor",
};

export type GroupEnvironment = {
    // Signup
    signup_enabled: boolean;
    signup_confirm_account_enabled: boolean;

    // Google OAuth Login
    login_google_enabled: boolean;
    google_client_id: string;

    // Google Recaptcha
    recaptcha_enabled: boolean;
    recaptcha_api_key: string;
    recaptcha_api_project_id: string;
    recaptcha_site_key: string;

    // KeyCloak
    keycloak_enabled: boolean;
    keycloak_client_id: string;
    keycloak_client_secret: string;
    keycloak_realm: string;
    keycloak_url: string;
    keycloak_redirect_url: string;

    // Email
    email_enabled: boolean;
    email_protocol: string;
    email_host: string;
    email_port: string;
    email_username: string;
    email_password?: string;

    // Email Notifications
    message_new_content_enabled: boolean;
    message_template_new_content: string;
    message_assigned_content_enabled: string;
    message_template_assigned_content: string;
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
