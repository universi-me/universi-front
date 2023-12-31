import { Profile } from "./Profile";
import { TypeExperience } from "./TypeExperience";

export type Experience = {
    id:                 string;
    profile:            Profile;
    typeExperience:     TypeExperience;
    local:              string;
    description:        string;
    startDate:          string;
    endDate:        string;
    presentDate:    boolean;
    creationDate:   string;
}