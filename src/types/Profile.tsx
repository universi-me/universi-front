import ProfileCard, { ProfileCardProps } from "@/components/ProfileCard";
import { UniversiFormCardSelectionInput, UniversiFormCardSelectionInputProps } from "@/components/UniversiForm/inputs/UniversiFormCardSelectionInput";
import { compareAccessLevel } from "@/types/User";
import { stringIncludesIgnoreCase } from "@/utils/stringUtils";
import UniversiForm from "@/components/UniversiForm";
import { useState } from "react";

export const GENDER_OPTIONS: {[k in Profile.Gender]: string} = {
    M: "Masculino",
    F: "Feminino",
    O: "Outro",
};

export function ProfileSelect( props: Readonly<ProfileSelectProps> ) {
    const { options, renderBio, renderDepartment, useLink, defaultValue, ...selectProps } = props;

    const [departmentsFilters, setDepartmentsFilters] = useState([]);

    return <UniversiFormCardSelectionInput
        { ...selectProps }
        defaultValue={ defaultValue?.map( ProfileClass.new ) }
        options={ options.map( ProfileClass.new ) }
        getOptionUniqueValue={ p => p.id }
        isSearchable
        searchFilter={ searchFilter }
        useAdvancedSearch={ availableDepartmentsInOptions().length > 0 }
        advancedSearchFilter={ advancedSearchFilter }
        advancedSearchFilterOptions={ advancedSearchFilterOptions }
        handleAdvancedSearch={ handleAdvancedSearch }
        render={ p => <ProfileCard
            profile={ p }
            renderDepartment
            inline
        /> }
    />

    function searchFilter( text: string, profile: ProfileClass ): boolean {
        return stringIncludesIgnoreCase( profile.fullname!, text )
            || Boolean( profile.department
                && (
                    stringIncludesIgnoreCase( profile.department.acronym, text )
                    || stringIncludesIgnoreCase( profile.department.name, text )
                )
            );
    }

    function advancedSearchFilter( profile: ProfileClass ): boolean {
        // check if the profile department is in the filters
        if (departmentsFilters?.length === 0) {
            return true; // no filters, show all
        }
        if (!profile.department) {
            return false; // no department, cannot match
        }
        if (departmentsFilters?.map( (d : any) => d.value ).includes(profile.department.id)) {
            return true; // department matches one of the filters
        }
        // department does not match any filter
        return false;
    }

    function handleAdvancedSearch(form: UniversiForm.Data<Record<string, any>>) {
        if (!form.confirmed) {
            //clean filtrers
            setDepartmentsFilters([]);
            return;
        }
        //set filters
        setDepartmentsFilters(form.body.department ?? []);
    }

    function advancedSearchFilterOptions () {
        return [
            <UniversiForm.Input.Select
                    param="department"
                    label="Filtrar por Órgão/Área"
                    options={ availableDepartmentsInOptions().map( d => ({ value: d.id, label: d.acronym + ' – ' + d.name, })) }
                    defaultValue={ departmentsFilters }
                    getOptionUniqueValue={ t => t.value }
                    getOptionLabel={ t => t.label }
                    isMultiSelection
            />,
        ];
    }

    // Returns a list of available departments in the options, removing duplicates.
    function availableDepartmentsInOptions() {
        return options?.map( p => p.department )
            .filter( d => d !== null )
            .filter((item, index, self) => self.findIndex(d => d.id === item.id) === index)
            .sort( (a, b) => a.name.localeCompare(b.name) );
    }
}

export const USERNAME_CHAR_REGEX = /[a-z0-9_.-]/
export const USERNAME_REGEX = RegExp( "^" + String( USERNAME_CHAR_REGEX ).slice( 1, -1 ) + "+$" )
export function isValidUsernamePattern( username: string ): boolean {
    return USERNAME_REGEX.test( username );
}

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

export type ProfileSelectProps = Omit<
    UniversiFormCardSelectionInputProps<ProfileClass>,
    "getOptionUniqueValue" | "options" | "render" | "defaultValue" | "searchFilter"
> & Omit<
    ProfileCardProps,
    "profile"
> & {
    options: Profile.DTO[];
    defaultValue?: Profile.DTO[];
};
