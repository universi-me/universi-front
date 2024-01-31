import { Institution } from "./Institution";
import { Profile } from "./Profile";
import { TypeEducation } from "./TypeEducation";


export type Education = {
    id:             string;
    profile:        Profile;
    typeEducation:  TypeEducation;
    institution:     Institution;
    startDate:      string;
    endDate:        string;
    presentDate:    boolean;
    creationDate:   string;
};

