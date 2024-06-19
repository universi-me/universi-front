import { CompetenceType } from "./Competence";
import { Institution } from "./Institution";
import { Profile } from "./Profile";

export type Job = {
    id: string;
    title: string;
    shortDescription: string;
    longDescription: string;
    institution: Institution;
    requiredCompetences: CompetenceType[];
    author: Profile;
    closed: boolean;
};
