import { Profile } from "./Profile";

export type Experience = {
    id:                 string;
    profile:            Profile;
    typeExperience:     TypeExperience;
    local:              ExperienceLocal;
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

export type ExperienceLocal = {
    id:           string;
    name:         string;
    creationDate: string;
}
