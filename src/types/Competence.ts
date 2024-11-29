export type Competence = {
    id: string;
    description: string;
    level: Level;
    creationDate: string;
    competenceType: CompetenceType;
    title: string | null;
    startDate: string | null;
    presentDate: string | null;
    endDate: string | null;
};

export type CompetenceType = {
    id: string;
    name: string;
    reviewed: boolean;
};

export type CompetenceProfileDTO = Competence & {
    hasBadge: boolean;
}


export type Level = 0 | 1 | 2 | 3;

export function intToLevel(int: number): Level {
    return int % 4 as Level;
}

export const LevelToLabel: { [l in Level]: string } = {
    0: "📚Aprendiz",
    1: "🌱Iniciante",
    2: "🛠️Intermediário",
    3: "💪Experiente",
};

export const LevelToDescription: { [l in Level]: string } = {
    0: "Você está aprendendo a tecnologia. Sabe fazer exemplos básicos e segue tutoriais.",
    1: "Você já consegue fazer projetos simples, mas não entende de aspectos mais complexos.",
    2: "Você consegue fazer projetos complexos, sem precisar ficar consultando questões básicas. Você consegue ensinar pessoas iniciantes.",
    3: "Você consegue fazer projetos complexos e atuar em melhorias sobre a tecnologia. Consegue explorar aspectos profundos sobre este conhecimento. Você consegue ensinar pessoas com nível intermediário.",
}
