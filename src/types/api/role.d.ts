namespace Role {
    type DTO = {
        id: string;
        name: string;
        description: string;
        created: string;
        roleType: Type;
        canBeEdited: boolean;
        canBeAssigned: boolean;
        permissions: {
            [k in Feature]: number;
        };
    };

    type Type = "ADMINISTRATOR" | "PARTICIPANT" | "VISITOR" | "CUSTOM";

    type Feature = "FEED" | "CONTENT" | "GROUP" | "PEOPLE" | "COMPETENCE" | "JOBS"

    type Permission = 0 | 1 | 2 | 3 | 4;
}
