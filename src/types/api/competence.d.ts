namespace Competence {
    type DTO = {
        id: string;
        competenceType: Type;
        profile: Profile.DTO;
        description: string;
        level: Level;
        creationDate: string;
        hasBadge: boolean;
    };

    type Type = {
        id: string;
        name: string;
        reviewed: boolean;
    };

    type Level = 0 | 1 | 2 | 3;

    type Info = {
        competenceName: string;
        competenceTypeId: string;
        levelInfo: {
            [ k: number ]: Profile.DTO[];
        }
    };
}
