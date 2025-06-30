import { UniversimeApi } from "@/services"

export type CanI_AsyncFunction = (feature: Role.Feature, permission?: Permission, optionalGroup?: Group.DTO | undefined) => Promise<boolean>;

/**
 * Similar to the `useCanI` hook, but doesn't return a function. Uses localStorage
 * data when available and does API request when not. Can be used without a DOM
 * and is asynchronous.
 *
 * @param feature The `FeatureTypes` being checked
 * @param permission The `Permission` required on the feature. Uses `Permission.READ` by default.
 * @param group The `Group` being checked. Uses the current organization by default.
 * @param profile The `Profile` being checked. Uses the logged user by default.
 * 
 * @example
 * const canReadFeed = await canI_API("FEED", Permission.READ, groupContext.group);
 * const canPost = await canI_API("FEED", Permission.READ_WRITE, groupContext.group);
 */
export async function canI_API(feature: Role.Feature, permission: Permission = Permission.READ, group?: Group.DTO): Promise<boolean> {
    if ( !group ) {
        group = ( await UniversimeApi.Group.currentOrganization() ).data;
    }

    if (!group)
        return false;

    return ( group.role?.permissions[feature] ?? 0 ) >= permission;
}

/**
 * Fetch current user roles from local storage (if available) or refetch from API (if not)
 */
export async function fetchRoles(): Promise<Role.DTO[] | undefined> {
    const res = await UniversimeApi.User.account();
    return res.isSuccess()
        ? res.data.roles
        : undefined;
}

export function rolesSorter(a: Role.DTO, b: Role.DTO): number {
    const orderHelper: { [k in Role.Type]: number } = {
        ADMINISTRATOR: 0,
        PARTICIPANT: 1,
        VISITOR: 2,
        CUSTOM: 3,
    };

    return orderHelper[a.roleType] - orderHelper[b.roleType];
}

export enum Permission {
    NONE = 0,
    DISABLED = 1,
    READ = 2,
    READ_WRITE = 3,
    READ_WRITE_DELETE = 4,
    DEFAULT = READ_WRITE_DELETE,
}

export const FeatureTypesToLabel: { [k in Role.Feature]: string } = {
    "FEED":         "Publicações",
    "CONTENT":      "Conteúdo",
    "GROUP":        "Grupo",
    "PEOPLE":       "Pessoas",
    "COMPETENCE":   "Competência",
    "JOBS":         "Vagas",
};
