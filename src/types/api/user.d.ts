namespace User {
    type DTO = {
        id: string;
        name: string;
        email?: string;
        ownerOfSession: boolean;
        needProfile: boolean;
        accessLevel?: AccessLevel;
        hasPassword?: boolean;
        blocked_account?: boolean;
        temporarilyPassword?: boolean;
    };

    type AccessLevel = "ROLE_USER" | "ROLE_DEV" | "ROLE_ADMIN";
}

type User = User.DTO;
type UserAccessLevel = User.AccessLevel;
