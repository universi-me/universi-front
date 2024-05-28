import { useContext } from "react";

import { AuthContext } from "@/contexts/Auth";

import { Group } from "@/types/Group";
import { FeatureTypes, Permission } from "@/types/Roles";


export type CanI_SyncFunction = (feature: FeatureTypes, permission?: Permission, optionalGroup?: Group | undefined) => boolean;

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

    return function(feature: FeatureTypes, permission = Permission.READ, optionalGroup?: Group): boolean {
        if (optionalGroup === undefined && auth.organization === null) return false;

        const group = (optionalGroup ?? auth.organization)!;

        return group.permissions[feature] >= permission;
    };
}
