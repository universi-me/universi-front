namespace Group {
    type DTO = {
        id: Optional<string>;
        nickname: string;
        name: string;
        path: string;
        description: Optional<string>;
        image: Nullable<string>;
        bannerImage: Nullable<string>;
        headerImage: Nullable<string>;
        admin: Optional<Profile.DTO>;
        groupSettings: Settings;
        type: Type;
        rootGroup: Optional<boolean>;
        canCreateGroup: Optional<boolean>;
        canEnter: Optional<boolean>;
        canAddParticipant: Optional<boolean>;
        createdAt: Optional<string>;
        publicGroup: Optional<boolean>;
        enableCurriculum: Optional<boolean>;
        everyoneCanPost: boolean;
        buildHash: Optional<string>;
        canEdit: Optional<boolean>;
        organization: Possibly<Group>;

        permissions: {
            [ k in Role.Feature ]: Role.Permission;
        };
    };

    type Settings = {
        theme: Nullable<Theme>;
        environment: Nullable<{
            [k in keyof Environment]?: Environment[k];
        }>;
    };

    type Theme = {
        primaryColor: string;
        secondaryColor: string;
        backgroundColor: string;
        cardBackgroundColor: string;
        cardItemColor: string;
        fontColorV1: string;
        fontColorV2: string;
        fontColorV3: string;
        fontColorLinks: string;
        fontColorDisabled: string;
        buttonHoverColor: string;
        fontColorAlert: string;
        fontColorSuccess: string;
        wrongInvalidColor: string;
    };

    type Environment = {
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

    type Type = "INSTITUTION" | "CAMPUS" | "COURSE" | "PROJECT" | "CLASSROOM" | "MONITORIA" | "LABORATORY"
              | "ACADEMIC_CENTER" | "DEPARTMENT" | "STUDY_GROUP" | "GROUP_GENERAL" | "DIRECTORATE" | "MANAGEMENT"
              | "COORDINATION" | "COMPANY_AREA" | "DEVELOPMENT_TEAM" | "INTEREST_GROUP" | "MISCELLANEOUS_SUBJECTS"
              | "ENTERTAINMENT";

    namespace EmailFilter {
        type DTO = {
            id: string;
            enabled: boolean;
            type: Type;
            email: string;
            added: string;
        };

        type Type = "END_WITH" | "START_WITH" | "CONTAINS" | "EQUALS" | "MASK" | "REGEX";
    }
}
