namespace Experience {
    type DTO = {
        id: string;
        experienceType: Type;
        institution: Institution.DTO;
        description: string;
        startDate: string;
        endDate: Nullable<string>;
        profile: Profile.DTO;
        creationDate: string;
    };

    type Type = {
        id: string;
        name: string;
        creationDate: string;
    };
}

type Experience = Experience.DTO;
type TypeExperience = Experience.Type;
