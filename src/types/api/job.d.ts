namespace Job {
    type DTO = {
        id: string;
        title: string;
        shortDescription: string;
        longDescription: string;
        institution: Institution.DTO;
        requiredCompetences: Competence.Type[];
        author: Profile.DTO;
        closed: boolean;
    };
}
