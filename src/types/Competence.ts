import type { Profile } from '@/types/Profile'

export type Competence = {
    id: number;
    description: string;
    level: Level;
    creationDate: string;
    competenceType: CompetenceType;
    profile: Profile;
};

export type CompetenceType = {
    id: number;
    name: string;
};

export type Level = "NO_EXPERIENCE" | "LITTLE_EXPERIENCE" | "EXPERIENCED" | "VERY_EXPERIENCED" | "MASTER";

export const LevelToLabel = {
    "NO_EXPERIENCE":     "Nenhuma Experiência",
    "LITTLE_EXPERIENCE": "Pouca Experiência",
    "EXPERIENCED":       "Experiente",
    "VERY_EXPERIENCED":  "Muito Experiente",
    "MASTER":            "Master",
};

export const LevelToNumber = {
    "NO_EXPERIENCE":     0,
    "LITTLE_EXPERIENCE": 1,
    "EXPERIENCED":       2,
    "VERY_EXPERIENCED":  3,
    "MASTER":            4,
};
