import UniversimeApi from "@/services/UniversimeApi";
import { FeatureTypes, Roles, RolesFeature, Permission } from "@/types/Roles";
import { Profile } from "@/types/Profile";
import { AuthContext } from "@/contexts/Auth";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Group } from "@/types/Group";


/**
 * Check if the user has permission to do something
 * @param featureType The feature type
 * @param permission The permission, if not provided, will return number of permission of user
 * @param profile The profile
 * @param group The group
 * @returns The permission or false if the user does not have permission
 */
export function canI(featureType: FeatureTypes, permission?: Permission,  profile?: Profile, group?: Group): number | boolean {
  const auth = useContext(AuthContext);
  const defaultPermission = Permission.DEFAULT;
  let returnValueAsBollean = (permission != null || permission != undefined);
  
  // get roles from local storage
  let roles = localStorage.getItem('roles') ? JSON.parse(localStorage.getItem('roles') as string) : null;
  
  if(roles) {
    
    // get feature from roles, based in group and profile
    let cachedPaper = roles!?.findLast((r :any) => r.group === (group?.id ?? auth.organization?.id) && r.profile === (profile?.id ?? auth.profile?.id));

    if (cachedPaper) {
      const featureR = (cachedPaper?.features as any)?.findLast((f :any) => f.featureType === featureType);
      if(returnValueAsBollean) {
        return  (featureR ? (featureR.permission >= permission!)? true : false : (defaultPermission > Permission.DISABLED));
      }
      return  (featureR ? featureR.permission ?? defaultPermission : defaultPermission);
    }
  }

  return returnValueAsBollean? (defaultPermission > Permission.DISABLED) : defaultPermission;
}




