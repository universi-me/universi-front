import { compareAccessLevel } from "@/types/User";
import { IMG_DEFAULT_PROFILE } from "@/utils/assets";

export const GENDER_OPTIONS: {[k in Profile.Gender]: string} = {
    M: "Masculino",
    F: "Feminino",
    O: "Outro",
};

export class ProfileClass implements Profile.DTO {
    constructor(private readonly profile: Profile.DTO) {}

    /**
     * Builds the full name of the profile.
     *
     * @returns {(string | null)} The concatenation of the first and last names, with a space in between
     * or `null` if both are null.
     */
    get fullname(): Nullable<string> {
        const hasFirst = this.firstname && this.firstname.length > 0;
        const hasLast = this.lastname && this.lastname.length > 0;

        if (!hasFirst && !hasLast)
            return null;

        return ( this.firstname ?? "" )
            + ( hasFirst && hasLast ? " " : "" )
            + ( this.lastname ?? "" );
    }

    /**
     * User readable gender name, instead of the API value.
     */
    get genderName() {
        if (this.gender)
            return GENDER_OPTIONS[this.gender];

        // todo: use a constant with this value
        return "Não informado";
    }

    /**
     * Image URL ready to be used on an `<img>`.
     */
    get imageUrl() {
        if (this.image === null)
            return null;

        if (this.image.startsWith("/")) {
            return import.meta.env.VITE_UNIVERSIME_API + this.image;
        }

        return `${import.meta.env.VITE_UNIVERSIME_API}/profiles/${this.user.name}/image`;
    }

    /**
     * Created date as `Date` instead of string;
     */
    get createdAt() {
        return new Date(this.creationDate);
    }

    /**
     * Returns `true` if this person's name includes `search`, ignoring name and `search` casing.
     */
    nameIncludesIgnoreCase(search: string): boolean {
        return this.fullname === null
            ? false
            : this.fullname.toLowerCase().includes(search.toLowerCase());
    }

    /**
     * Separates a full name into a first name and a last name.
     *
     * @param {string} fullname The full name to be separated.
     * @returns {[string, string]} An 2 element array, where the first element is
     * the first name and the second is the last name or `undefined`, if `fullname`
     * doesn't have a last name.
     */
    public static separateFullname(fullname: string): [string, string | undefined] {
        fullname = fullname.trim();
        const spaceIndex = fullname.indexOf(" ");

        if (fullname.length === 0 || spaceIndex < 0)
            return [fullname, undefined];

        const firstname = fullname.slice(0, spaceIndex);
        const lastname = fullname.slice(spaceIndex + 1);

        return [
            firstname,
            lastname,
        ];
    }

    /**
     * The same as `new ProfileClass(profile)`, but can be used as a callback function.
     */
    public static new(profile: Profile.DTO) {
        return new ProfileClass(profile);
    }

    /**
     * Compares two profiles to determine sorted order
     */
    public static compare(a: ProfileClass, b: ProfileClass) {
        const aLevel = a.user.accessLevel;
        const bLevel = b.user.accessLevel;

        if (aLevel && bLevel && aLevel !== bLevel)
            return compareAccessLevel(aLevel, bLevel);

        return (a.fullname ?? "").localeCompare(b.fullname ?? "");
    }

    /* Profile type getters and setters */
    get id() { return this.profile.id }
    set id(id: string) { this.profile.id = id }

    get user() { return this.profile.user }
    set user(user: User.DTO) { this.profile.user = user }

    get firstname() { return this.profile.firstname }
    set firstname(firstname: Nullable<string>) { this.profile.firstname = firstname }

    get lastname() { return this.profile.lastname }
    set lastname(lastname: Nullable<string>) { this.profile.lastname = lastname }

    get bio() { return this.profile.bio }
    set bio(bio: Nullable<string>) { this.profile.bio = bio }

    get gender() { return this.profile.gender }
    set gender(gender: Nullable<Profile.Gender>) { this.profile.gender = gender }

    get image() { return this.profile.image }
    set image(image: Nullable<string>) { this.profile.image = image }

    get creationDate() { return this.profile.creationDate }

    get role(): Role.DTO | undefined | null { return this.profile.role }
    set role(role: Role.DTO | undefined | null) { this.profile.role = role }

    get department() { return this.profile.department; }
    set department( department: Nullable<Department.DTO> ) { this.profile.department = department; }
}
