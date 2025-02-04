import { createApiInstance } from "./api";
import { type ApiResponse } from "@/types/UniversimeApi";
import { type User, type UserAccessLevel } from "@/types/User";

const api = createApiInstance( "/admin" )

export type AdminEditAccount_RequestDTO = {
    userId: string;
    username?: string;
    email?: string;
    password?: string;
    authorityLevel?: UserAccessLevel;
    emailVerified?: boolean;
    blockedAccount?: boolean;
    inactiveAccount?: boolean;
    credentialsExpired?: boolean;
    expiredUser?: boolean;
};

export type AdminListAccounts_RequestDTO = {
    accessLevel?: UserAccessLevel;
};

export type CompetenceTypeRemove_RequestDTO = {
    id: string;
};

export type CompetenceTypeMerge_RequestDTO = {
    removedCompetenceTypeId:   string;
    remainingCompetenceTypeId: string;
};

export type AdminEditAccount_ResponseDTO = ApiResponse;
export type AdminListAccounts_ResponseDTO = ApiResponse<{ users: User[] }>;

export async function editAccount(body: AdminEditAccount_RequestDTO) {
    return (await api.post<AdminEditAccount_ResponseDTO>("/account/edit", {
        userId: body.userId,
        username: body.username,
        email: body.email,
        password: body.password,
        authorityLevel: body.authorityLevel,
        emailVerified: body.emailVerified,
        blockedAccount: body.blockedAccount,
        inactiveAccount: body.inactiveAccount,
        credentialsExpired: body.credentialsExpired,
        expiredUser: body.expiredUser,
    })).data;
}

export async function listAccounts(body: AdminListAccounts_RequestDTO) {
    return (await api.post<AdminListAccounts_ResponseDTO>("/account/list", {
        accessLevel: body.accessLevel,
    })).data;
}
