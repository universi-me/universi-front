import type { User } from "@/types/User";
import { Group } from "./Group";

export type Gender = "M" | "F" | "O";

export type Profile = {
    id:           string;
    user:         User;
    firstname:    string | null;
    gender:       Gender | null;
    image:        string | null;
    lastname:     string | null;
    bio:          string | null;
    creationDate: string;
    organization: Group;
}
