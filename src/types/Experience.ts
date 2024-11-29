import { Institution } from "@/types/Institution";
import { Profile } from "./Profile";

export type Experience = {
    id:                 string;
    profile:            Profile;
    typeExperience:     TypeExperience;
    institution:        Institution;
    description:        string;
    startDate:          string;
    endDate:        string;
    presentDate:    boolean;
    creationDate:   string;
}

export type TypeExperience = {
    id:             string;
    name:           string;
}
