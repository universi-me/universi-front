namespace Education {
    type DTO = {
        id: string;
        educationType: Type;
        institution: Institution.DTO;
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
};

type Education = Education.DTO;
type TypeEducation = Education.Type;
