import UniversimeApi from "@/services/UniversimeApi";
import { FeatureTypes, Roles, Permission, RoleType } from "@/types/Roles";
import { Profile } from "@/types/Profile";
import { Group } from "@/types/Group";

export type CanI_AsyncFunction = (feature: FeatureTypes, permission?: Permission, optionalGroup?: Group | undefined) => Promise<boolean>;

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
export async function canI_API(feature: FeatureTypes, permission: Permission = Permission.READ, group?: Group): Promise<boolean> {
    [group] = await Promise.all([
        group ?? (await UniversimeApi.User.organization()).body?.organization ?? undefined,
    ]);

    if (!group)
        return false;

    return (group.permissions[feature]) >= permission;
}

/**
 * Fetch current user roles from local storage (if available) or refetch from API (if not)
 */
export async function fetchRoles(): Promise<Roles[] | undefined> {
    const data = await UniversimeApi.Roles.listRoles()
    if (!data.success)
        return undefined;

    return data.body.roles;
}

export function rolesSorter(a: Roles, b: Roles): number {
    const orderHelper: { [k in RoleType]: number } = {
        ADMINISTRATOR: 0,
        PARTICIPANT: 1,
        VISITOR: 2,
        CUSTOM: 3,
    };

    return orderHelper[a.roleType] - orderHelper[b.roleType];
}
