import { ApiResponse } from "@/utils/apiUtils";
import { createApiInstance } from "./api";

const api = createApiInstance( "" )


export function account() {
    return api.get<UserAccount_ResponseDTO>( "/account" ).then( ApiResponse.new );
}

export function changePassword( body: UserChangePassword_ResponseDTO ) {
    return api.patch<undefined>( "/account", body ).then( ApiResponse.new );
}

export function logout() {
    return api.get<boolean>( "/logout" ).then( ApiResponse.new );
}

export function signup( body: UserSignup_RequestDTO ) {
    return api.post<boolean>( "/signup", body ).then( ApiResponse.new );
}

export function usernameAvailable( username: string ) {
    return api.get<UserGetAvailable_ResponseDTO>( `/available/username/${username}` ).then( ApiResponse.new );
}

export function emailAvailable( email: string ) {
    return api.get<UserGetAvailable_ResponseDTO>( `/available/email/${email}` ).then( ApiResponse.new );
}

export function updateAccount( body: UserAccountUpdate_RequestDTO ) {
    return api.patch<undefined>( "/admin/account", body ).then( ApiResponse.new );
}

export function listByAccessLevel( accessLevel: User.AccessLevel ) {
    return api.get<User.DTO[]>( `/admin/accounts/${accessLevel}` ).then( ApiResponse.new );
}


export type UserAccount_ResponseDTO = {
    user: User.DTO;
    roles: Role.DTO[];
};

export type UserChangePassword_ResponseDTO = {
    password: string;
    newPassword: string;
};

export type UserSignup_RequestDTO = {
    recaptchaToken: Optional<string>;
    username: string;
    email: string;
    password: string;
    firstname: string;
    lastname: string;
};

export type UserGetAvailable_ResponseDTO = {
    available: boolean;
    reason: string;
};

export type UserAccountUpdate_RequestDTO = {
    userId: string;
    username: Optional<string>;
    email: Optional<string>;
    password: Optional<string>;
    authorityLevel: Optional<string>;
    emailVerified: Optional<boolean>;
    blockedAccount: Optional<boolean>;
    inactiveAccount: Optional<boolean>;
    credentialsExpired: Optional<boolean>;
    expiredUser: Optional<boolean>;
};

export type UserLoginKeycloak_RequestDTO = {
    token: string;
};
