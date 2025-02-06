namespace Profile {
    type DTO = {
        id: string;
        user: User.DTO;
        firstname: Nullable<string>;
        lastname: Nullable<string>;
        image: Nullable<string>;
        bio: Nullable<string>;
        gender: Nullable<Gender>;
        creationDate: string;
        role: Optional<Role>;
    };

    type Gender = "M" | "F" | "O";
}

type Profile = Profile.DTO;
type Gender = Profile.Gender;
