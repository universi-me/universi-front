namespace Competence {
    type DTO = {
        id: string;
        competenceType: Type;
        profile: Profile.DTO;
        description: string;
        level: Level;
        creationDate: string;
        hasBadge: boolean;
        activities: Activity.DTO[];
    };

    type Type = {
        id: string;
        name: string;
        reviewed: boolean;
    };

    type Level = 0 | 1 | 2 | 3;
}

type Competence = Competence.DTO;
type CompetenceType = Competence.Type;
type CompetenceLevel = Competence.Level;
