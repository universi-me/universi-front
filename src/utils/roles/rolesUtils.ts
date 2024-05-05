import UniversimeApi from "@/services/UniversimeApi";
import { FeatureTypes, RoleDTO, Permission, RolesFeature } from "@/types/Roles";
import { Profile } from "@/types/Profile";
import { Group } from "@/types/Group";

export type CanI_AsyncFunction = (feature: FeatureTypes, permission?: Permission, optionalGroup?: Group | undefined, optionalProfile?: Profile | undefined) => Promise<boolean>;

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
export async function canI_API(feature: FeatureTypes, permission: Permission = Permission.READ, group?: Group, profile?: Profile): Promise<boolean> {
    const roles = await fetchRoles();

    if (roles === undefined)
        return false;

    [profile, group] = await Promise.all([
        profile ?? (await UniversimeApi.Profile.profile()).body?.profile,
        group ?? (await UniversimeApi.User.organization()).body?.organization ?? undefined,
    ]);

    if (!profile || !group)
        return false;

    return findFeaturePermission(feature, profile, group, roles) >= permission;
}

/**
 * Fetch current user roles from local storage (if available) or refetch from API (if not)
 */
export async function fetchRoles(): Promise<RoleDTO[] | undefined> {
    return getRolesFromLocalStorage() ?? await updateRolesLocalStorage();
}

export async function updateRolesLocalStorage() {
    const data = await UniversimeApi.Roles.listRoles();

    if (data.success) {
        saveRolesLocalStorage(data.body.roles);
        return data.body.roles;
    } else {
        removeRolesLocalStorage();
        return undefined;
    }
}

const ROLES_LOCAL_STORAGE_KEY = "roles";
function saveRolesLocalStorage(roles: RoleDTO[]) {
    if(roles.length) {
        localStorage.setItem(ROLES_LOCAL_STORAGE_KEY, JSON.stringify(roles));
    }
}

function removeRolesLocalStorage() {
    localStorage.removeItem(ROLES_LOCAL_STORAGE_KEY);
}

function getRolesFromLocalStorage(): RoleDTO[] | null {
    const item = localStorage.getItem(ROLES_LOCAL_STORAGE_KEY);
    return item && JSON.parse(item);
}

function isAdminRole(role : RoleDTO) {
  return role != null && role.id == '00000000-0000-0000-0000-000000000001';
}

function findGroupRole(profile: Profile, group: Group, roles: RoleDTO[]) {
    let groupRole = roles.find(r => r.group === group.id && r.profile === profile.id);
    if (groupRole)
        return groupRole;

    const systemRoles = roles.filter(r => r.group === null && r.profile === profile.id);
    const adminRole = systemRoles.find(isAdminRole);
    const userRole = systemRoles.find(r => !isAdminRole(r));

    return profile.user.accessLevel === "ROLE_ADMIN"
        ? (adminRole ?? userRole)
        : userRole;
}

export function findFeaturePermission(feature: FeatureTypes, profile: Profile, group: Group, roles: RoleDTO[]): Permission {
    const role = findGroupRole(profile, group, roles);

    if (role === undefined)
        return Permission.NONE;

    return (role.features ?? [])
        .find(f => f.featureType === feature)
        ?.permission
            ?? Permission.NONE;
}
