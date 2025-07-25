export const UserAccessLevelLabel: { [k in User.AccessLevel]: string } = {
    ROLE_ADMIN: "Administrador",
    ROLE_DEV: "Desenvolvedor",
    ROLE_USER: "Usuário",
}

export function compareAccessLevel(a: User.AccessLevel, b: User.AccessLevel): number {
    const A_FIRST = -1;
    const KEEP_ORDER = 0;
    const B_FIRST = 1;

    if (a === b) {
        return KEEP_ORDER;
    }

    if (a === "ROLE_ADMIN") {
        return A_FIRST;
    }

    if (b === "ROLE_ADMIN") {
        return B_FIRST;
    }

    if (a === "ROLE_DEV") {
        return A_FIRST;
    }

    if (b === "ROLE_DEV") {
        return B_FIRST;
    }

    return KEEP_ORDER;
}
