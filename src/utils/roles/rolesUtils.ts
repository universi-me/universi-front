import UniversimeApi from "@/services/UniversimeApi";
import { FeatureTypes, Roles, RolesFeature, Permission } from "@/types/Roles";
import { Profile } from "@/types/Profile";
import { AuthContext } from "@/contexts/Auth";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Group } from "@/types/Group";
import { get } from "@/services/UniversimeApi/Profile";


/**
 * Check if the user has permission to do something
 * @param featureType The feature type
 * @param permission The permission, if not provided, will return number of permission of user
 * @param profile The profile
 * @param group The group
 * @returns The permission or false if the user does not have permission
 */
export function canI(featureType: FeatureTypes, permission?: Permission, group?: Group, profile?: Profile): number | boolean {
  const auth = useContext(AuthContext);

  const defaultPermission = Permission.DEFAULT;
  let returnValueAsBoolean = (permission != null || permission != undefined);

  let getGroup = group ?? auth.organization;
  let getProfile = profile ?? auth.profile;

  // get roles from local storage
  let roles = localStorage.getItem('roles') ? JSON.parse(localStorage.getItem('roles') as string) : null;
  
  if(roles) {

    // get feature from roles, based in group and profile
    let cachedRoles = roles!?.findLast((r :any) => r.group === getGroup?.id && r.profile === getProfile?.id);

    if (cachedRoles) {
      const featureR = (cachedRoles?.features as any)?.findLast((f :any) => f.featureType === featureType);
      if(returnValueAsBoolean) {
        return  (featureR ? (featureR.permission >= permission!) : (defaultPermission > Permission.DISABLED));
      }
      return  (featureR ? featureR.permission ?? defaultPermission : defaultPermission);
    }
  }

  return returnValueAsBoolean ? (defaultPermission > Permission.DISABLED) : defaultPermission;
}




