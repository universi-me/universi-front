import type { Profile } from "@/types/Profile"

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
