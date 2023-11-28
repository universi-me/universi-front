import type { User } from "@/types/User";

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
    get user() { return this.profile.user }
    get firstname() { return this.profile.firstname }
    get lastname() { return this.profile.lastname }
    get bio() { return this.profile.bio }
    get gender() { return this.profile.gender }
    get image() { return this.profile.image }
    get creationDate() { return this.profile.creationDate }
}
