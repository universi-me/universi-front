import type { Profile, Gender } from "@/types/Profile"

export const GENDER_OPTIONS = {
    "M": "Masculino",
    "F": "Feminino",
    "O": "Outro",
}

export function getFullName(profile: Profile): string {
    const first = profile.firstname ?? "";
    const last = profile.lastname ?? "";

    return `${first}${first != "" ? " " : ""}${last}`
}

export function separateFullName(fullname: string): [string, string] {
    const names = fullname.split(' ');

    if (names.length <= 0)
        return ['', ''];

    return [
        names[0],
        names.slice(1).join(' ')
    ]
}

export function getGenderName(gender: Gender | null | undefined): string {
    return gender ? GENDER_OPTIONS[gender] : 'Não informado';
}
