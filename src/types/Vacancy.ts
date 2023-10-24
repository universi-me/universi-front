import { Profile } from "./Profile";
import { TypeVacancy } from "./TypeVacancy";


export type Vacancy = {
    creationDate: string | number | Date;
    id:                     string;
    profile:                Profile;
    typeVacancy:            TypeVacancy;
    title:                  string;
    description:            string;
    prerequisites:          string;
    registrationDate:       string;
    endRegistrationDate:    string;
}