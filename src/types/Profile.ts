import type { User } from "@/types/User";
import type { Competence } from "@/types/Competence";
import type { Recommendation } from "@/types/Recommendation";

export type Gender = "M" | "F" | "O";

export type Profile = {
    id:                     number;
    user:                   User;
    usuario:                User;
    firstname:              string | null;
    gender:                 Gender | null;
    image:                  string | null;
    lastname:               string | null;
    sexo:                   Gender | null;
    bio:                    string | null;
    creationDate:           string;
    competences:            Competence[];
    groups:                 number[];
    recomendacoesFeitas:    Recommendation[];
    recomendacoesRecebidas: Recommendation[];

    // todo: type this properties
    links:                  any[];
}
