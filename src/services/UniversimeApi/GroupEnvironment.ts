import { createApiInstance } from "./api";
import { ApiResponse } from "@/utils/apiUtils";

const api = createApiInstance( "/group/settings/environments" )

export function update( body: GroupEnvironmentUpdate_RequestDTO ) {
    return api.patch<Group.Environment>( "", body ).then( ApiResponse.new );
}

export function get() {
    return api.get<Group.Environment>( "" ).then( ApiResponse.new );
}

export type GroupEnvironmentUpdate_RequestDTO = {
    signup_enabled: Optional<boolean>;
    signup_confirm_account_enabled: Optional<boolean>;
    login_google_enabled: Optional<boolean>;
    google_client_id: Optional<string>;
    recaptcha_enabled: Optional<boolean>;
    recaptcha_api_key: Optional<string>;
    recaptcha_api_project_id: Optional<string>;
    recaptcha_site_key: Optional<string>;
    keycloak_enabled: Optional<boolean>;
    keycloak_client_id: Optional<string>;
    keycloak_client_secret: Optional<string>;
    keycloak_realm: Optional<string>;
    keycloak_url: Optional<string>;
    keycloak_redirect_url: Optional<string>;
    alert_new_content_enabled: Optional<boolean>;
    message_template_new_content: Optional<string>;
    alert_assigned_content_enabled: Optional<boolean>;
    message_template_assigned_content: Optional<string>;
    email_enabled: Optional<boolean>;
    email_host: Optional<string>;
    email_port: Optional<string>;
    email_protocol: Optional<string>;
    email_username: Optional<string>;
    email_password: Optional<string>;
};
