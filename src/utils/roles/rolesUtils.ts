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
export function canI(featureType: FeatureTypes, permission?: Permission, group?: Group, profile?: Profile): boolean | number  {
  let returnValueAsBoolean = (permission != null || permission != undefined);
  const defaultPermission = Permission.DEFAULT;
  
  let returnVal = returnValueAsBoolean ? (defaultPermission > Permission.DISABLED) : defaultPermission;

  let getGroup = group ?? useContext(AuthContext).organization;
  let getProfile = profile ?? useContext(AuthContext).profile;

  // get roles from local storage
  let roles = localStorage.getItem('roles') ? JSON.parse(localStorage.getItem('roles') as string) : null;

  if(roles ===  null || !roles) {
    // get roles from API
    return UniversimeApi.Roles.listRoles().then((res) => {
      if(res.success && res.body.roles) {
        localStorage.setItem('roles', JSON.stringify(res.body.roles));
        return canI(featureType, permission, group, profile);
      }
    }) as any;
  }

  if(roles) {

    // get feature from roles, based in group and profile
    let roleBasedInGroup = roles!?.findLast((r :any) => r.group === getGroup?.id && r.profile === getProfile?.id);

    if (roleBasedInGroup) {
      let featureR = (roleBasedInGroup?.features as any)?.findLast((f :any) => f.featureType === featureType);
      if(returnValueAsBoolean) {
        returnVal = (featureR ? (featureR.permission >= permission!) : (defaultPermission > Permission.DISABLED));
      } else {
        returnVal = (featureR ? featureR.permission ?? defaultPermission : defaultPermission);
      }
    }
  }

  console.log(getGroup);
  console.log(getProfile);
  console.log(featureType);
  
  console.log(roles);
  console.log(returnVal);

  return returnVal;
}




