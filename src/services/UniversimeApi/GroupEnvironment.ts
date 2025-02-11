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
    signup_enabled?: boolean;
    signup_confirm_account_enabled?: boolean;
    login_google_enabled?: boolean;
    google_client_id?: string;
    recaptcha_enabled?: boolean;
    recaptcha_api_key?: string;
    recaptcha_api_project_id?: string;
    recaptcha_site_key?: string;
    keycloak_enabled?: boolean;
    keycloak_client_id?: string;
    keycloak_client_secret?: string;
    keycloak_realm?: string;
    keycloak_url?: string;
    keycloak_redirect_url?: string;
    alert_new_content_enabled?: boolean;
    message_template_new_content?: string;
    alert_assigned_content_enabled?: boolean;
    message_template_assigned_content?: string;
    email_enabled?: boolean;
    email_host?: string;
    email_port?: string;
    email_protocol?: string;
    email_username?: string;
    email_password?: string;
};
