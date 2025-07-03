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
        buildHash: Optional<string>;
        canEdit: Optional<boolean>;
        organization: Possibly<Group>;
        role: Optional<Role.DTO>;
    } & ({
        regularGroup: true;
        activity: null;
    } | {
        regularGroup: false;
        activity: Omit<Activity.DTO, "group">;
    });

    type Settings = {
        theme: Nullable<Theme>;
        environment: Nullable<Partial<Environment>>;
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
        recovery_enabled: boolean;

        // Google OAuth Login
        login_google_enabled: boolean;
        google_login_image_url: string;
        google_login_text: string;
        google_client_id: string;

        // Google Recaptcha
        recaptcha_enabled: boolean;
        recaptcha_api_key: string;
        recaptcha_api_project_id: string;
        recaptcha_site_key: string;

        // KeyCloak
        keycloak_enabled: boolean;
        keycloak_login_image_url: string;
        keycloak_login_text: string;
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
        message_assigned_content_enabled: boolean;
        message_template_new_content: string;
        message_assigned_content_enabled: string;
        message_template_assigned_content: string;

        organization_name: string;
        organization_nickname: string;
    };

    type Type = {
        label: string;
        id: string;
    };

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

    namespace Feature {
        type DTO = {
            id: string;
            name: string;
            description: string;
            enabled: boolean;
            added: string;
        };
    }

    type CompetenceInfo = {
        competenceName: string;
        competenceTypeId: string;
        levelInfo: {
            [ k: number ]: Profile.DTO[];
        }
    };
}

type Group = Group.DTO;
type GroupSettings = Group.Settings;
type GroupEmailFilter = Group.EmailFilter.DTO;
type GroupTheme = Group.Theme;
type GroupEnvironment = Group.Environment;
type GroupType = Group.Type;
type GroupEmailFilter = Group.EmailFilter.DTO;
type GroupEmailFilterType = Group.EmailFilter.Type;
type GroupFeature = Group.Feature.DTO;
type GroupCompetenceInfo = Group.CompetenceInfo;
