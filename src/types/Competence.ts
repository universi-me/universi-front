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
    0 : "📚Aprendiz",
    1 : "🌱Iniciante",
    2 : "🛠️Intermediário",
    3 : "💪Experiente",
};

export const LevelToDescription: {[l in Level]: string} = {
    0: "Você ainda está seguindo tutoriais e cursos sobre esse assunto. Não desanime!",
    1: "Você já começou a se virar, mas ainda tem certa dificuldade e precisa voltar às anotações de vez em quando.",
    2: "Você está indo muito bem! Ainda não sabe tudo que tem para saber, mas já tem certo domínio sobre esse assunto.",
    3: "Você é um profissional nesse assunto!",
}
