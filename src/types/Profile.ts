import type { User } from "@/types/User";
import { type Nullable } from "@/types/utils";

export type Gender = "M" | "F" | "O";

export type Profile = {
    id:           string;
    user:         User;
    firstname:    string | null;
    gender:       Gender | null;
    image:        string | null;
    lastname:     string | null;
    bio:          string | null;
    creationDate: string;
}

export class ProfileClass implements Profile {
    constructor(private profile: Profile) {}

    get id() { return this.profile.id }
    set id(id: string) { this.profile.id = id }

    get user() { return this.profile.user }
    set user(user: User) { this.profile.user = user }

    get firstname() { return this.profile.firstname }
    set firstname(firstname: Nullable<string>) { this.profile.firstname = firstname }

    get lastname() { return this.profile.lastname }
    set lastname(lastname: Nullable<string>) { this.profile.lastname = lastname }

    get bio() { return this.profile.bio }
    set bio(bio: Nullable<string>) { this.profile.bio = bio }

    get gender() { return this.profile.gender }
    set gender(gender: Nullable<Gender>) { this.profile.gender = gender }

    get image() { return this.profile.image }
    set image(image: Nullable<string>) { this.profile.image = image }

    get creationDate() { return this.profile.creationDate }
}
