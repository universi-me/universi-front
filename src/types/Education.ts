import { Institution } from "./Institution";
import { Profile } from "./Profile";
import { TypeEducation } from "./TypeEducation";


export type Education = {
    id:             string;
    profile:        Profile;
    typeEducation:  TypeEducation;
    institution:     Institution;
    startDate:      string | null;
    endDate:        string | null;
    presentDate:    string | null;
    creationDate:   string;
};

