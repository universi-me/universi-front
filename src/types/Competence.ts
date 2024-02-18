import type { Profile } from '@/types/Profile'

export type Competence = {
    id:             string;
    description:    string;
    level:          Level;
    creationDate:   string;
    competenceType: CompetenceType;
    profile:        Profile;
    title:          string | null;
    startDate:      string | null;
    presentDate:    string | null;
    endDate:        string | null;
};

export type CompetenceType = {
    id:   string;
    name: string;
    reviewed: boolean;
};


export type Level = 0 | 1 | 2 | 3 ;

export function intToLevel(int : number) : Level {
    return int%4 as Level;
}

export const LevelToLabel: {[l in Level]: string} = {
    0 : "Aprendiz📚",
    1 : "Iniciante🌱",
    2 : "Intermediário🛠️",
    3 : "Experiente💪",
};

