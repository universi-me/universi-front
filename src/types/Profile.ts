import type { User } from "@/types/User";

export type Profile = {
    user:         User;
    usuario:      User;
    firstname:    string | null;
    gender:       string | null;
    image:        string | null;
    lastname:     string | null;
    sexo:         string | null
    bio:          string | null;
    creationDate: string;

    // todo: type this properties
    groups:                 any[];
    links:                  any[];
    recomendacoesFeitas:    any[];
    recomendacoesRecebidas: any[];
}
