import { useContext } from "react";

import { AuthContext } from "@/contexts/Auth";
import { Permission } from "@/utils/roles/rolesUtils";



export type CanI_SyncFunction = (feature: Role.Feature, permission?: Permission, optionalGroup?: Pick<Group.DTO, "role"> | undefined) => boolean;

/**
 * React Hook that uses `AuthContext` data to verify if a user can use a feature in a group.
 * The following params are the ones of this method's returning function.
 *
 * @param feature The `FeatureTypes` being checked
 * @param permission The `Permission` required on the feature. Uses `Permission.READ` by default.
 * @param group The `Group` being checked. Uses the current organization by default.
 * 
 * @example
 * const canI = useCanI();
 * const canReadFeed = canI("FEED", Permission.READ, groupContext.group);
 * const canPost = canI("FEED", Permission.READ_WRITE, groupContext.group);
 */
export default function useCanI(): CanI_SyncFunction {
    const auth = useContext(AuthContext);

    return function(feature: Role.Feature, permission = Permission.READ, optionalGroup?: Pick<Group.DTO, "role">): boolean {
        if (optionalGroup === undefined && auth.organization === null) return false;

        const group = (optionalGroup ?? auth.organization)!;

        return ( group.role?.permissions[feature] ?? 0 ) >= permission;
    };
}
