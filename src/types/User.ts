export type UserAccessLevel = "ROLE_USER" | "ROLE_DEV" | "ROLE_ADMIN";

export type User = {
    id:             string;
    name:           string;
    email?:         string;
    ownerOfSession: boolean;
    needProfile:    boolean;
    accessLevel?:   UserAccessLevel;
}

export const UserAccessLevelLabel: { [k in UserAccessLevel]: string } = {
    ROLE_ADMIN: "Administrador",
    ROLE_DEV: "Desenvolvedor",
    ROLE_USER: "Usuário",
}
