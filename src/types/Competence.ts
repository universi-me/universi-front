export function intToLevel(int: number): Competence.Level {
    return int % 4 as Competence.Level;
}

export const LevelToLabel: { [l in Competence.Level]: string } = {
    0: "📚Aprendiz",
    1: "🌱Iniciante",
    2: "🛠️Intermediário",
    3: "💪Experiente",
};

export const LevelToDescription: { [l in Competence.Level]: string } = {
    0: "Você está aprendendo a tecnologia. Sabe fazer exemplos básicos e segue tutoriais.",
    1: "Você já consegue fazer projetos simples, mas não entende de aspectos mais complexos.",
    2: "Você consegue fazer projetos complexos, sem precisar ficar consultando questões básicas. Você consegue ensinar pessoas iniciantes.",
    3: "Você consegue fazer projetos complexos e atuar em melhorias sobre a tecnologia. Consegue explorar aspectos profundos sobre este conhecimento. Você consegue ensinar pessoas com nível intermediário.",
}

export function compareCompetenceTypes( c1: Competence.Type, c2: Competence.Type ): number {
    return c1.name.localeCompare( c2.name );
}
