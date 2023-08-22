import { Profile } from "@/types/Profile";
import { CompetenceType } from "@/types/Competence";

export type Recommendation = {
    id:             string;
    origin:         Profile;
    destiny:        Profile;
    competenceType: CompetenceType;
    description:    string;
    creationDate:   string;
};
