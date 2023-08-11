import type { User } from "@/types/User";

export type Gender = "M" | "F" | "O";

export type Profile = {
    id:           number;
    user:         User;
    firstname:    string | null;
    gender:       Gender | null;
    image:        string | null;
    lastname:     string | null;
    bio:          string | null;
    creationDate: string;
}
