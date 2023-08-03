import type { User } from "@/types/User";

type Gender = "M" | "F" | "O";

export type Profile = {
    id:           number;
    user:         User;
    usuario:      User;
    firstname:    string | null;
    gender:       string | null;
    image:        string | null;
    lastname:     string | null;
    sexo:         Gender | null;
    bio:          string | null;
    creationDate: string;

    // todo: type this properties
    groups:                 any[];
    links:                  any[];
    recomendacoesFeitas:    any[];
    recomendacoesRecebidas: any[];
}
