import UniversimeApi from "@/services/UniversimeApi";
import { FeatureTypes, Roles, RolesFeature, Permission } from "@/types/Roles";
import { Profile, ProfileClass } from "@/types/Profile";
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
export function canI(featureType: FeatureTypes, permission?: Permission, group?: Group, profile?: Profile): boolean | number  {
  let returnValueAsBoolean = (permission != null || permission != undefined);

  // get roles from local storage
  let roles = getRolesFromLocalStorage();
  if(roles ===  null || !roles) {
    // fetch roles from API
    return UniversimeApi.Roles.listRoles().then((data : any) => {
      if(data.success && data.body.roles) {
        saveRolesLocalStorage(data.body.roles);
      }
      return canI(featureType, permission, group, profile);
    });
  }

  // get feature from roles, based in group and profile
  let roleBasedInGroup : any = getRolesProfile(profile, group, roles);

  if (roleBasedInGroup) {
    let featureR = roleBasedInGroup.features.findLast((f :any) => f.featureType === featureType) ??
                        getDefaultRolesForProfile(profile, group, roles)?.features.findLast((f :any) => f.featureType === featureType);
    if(featureR) {
      if(returnValueAsBoolean) {
        return (featureR.permission >= permission!);
      } else {
        return featureR.permission;
      }
    }
  }

  return returnValueAsBoolean ? false : Permission.NONE;
}


export function getRolesProfile(profile? : Profile, group?: Group, roles?: Roles[]) : Roles {
  let getGroup = group ?? useContext(AuthContext).organization;
  let getProfile = profile ?? useContext(AuthContext).profile;

  let getRolesVar : any = roles && roles?.length > 0? roles:null  ?? getRoles() ?? useContext(AuthContext).roles;

  if(!getRolesVar) {
    return getRolesProfile(profile, group, roles);
  }

  return getRolesVar.findLast((r :any) => r.group === getGroup?.id && r.profile === getProfile?.id) ??
          getDefaultRolesForProfile(getProfile, getGroup, getRolesVar);
}

function getDefaultRolesForProfile(profile? : Profile | ProfileClass | null, group?: Group | null, roles?: Roles[]) {
  let getGroup = group ?? useContext(AuthContext).organization;
  let getProfile = profile ?? useContext(AuthContext).profile;
  let getRolesVar : any = roles ?? getRoles() ?? useContext(AuthContext).roles;

  let defaultAdmin = getRolesVar?.findLast((r :any) => r.group === null && isAdminRole(r) && r.profile === getProfile?.id);
  let defaultUser = getRolesVar?.findLast((r :any) => r.group === null && !isAdminRole(r) && r.profile === getProfile?.id);

  // check if gruop administrator
  if(group?.admin?.id == getProfile?.id ||
     (getGroup?.administrators as any)?.findLast((a :any) => a.id === getProfile?.id) ||
     getProfile?.user?.accessLevel == 'ROLE_ADMIN') {
    return defaultAdmin;
  }

  return defaultUser;
}


// get roles from local storage or refetch API
export function getRoles(): any {

  let roles = null;

  // get roles from local storage
  roles = getRolesFromLocalStorage();

  if(roles ===  null || !roles) {
    // fetch roles from API
    return UniversimeApi.Roles.listRoles().then((data : any) => {
      if(data.success && data.body.roles) {
        saveRolesLocalStorage(data.body.roles);
        roles = data.body.roles;
        return getRoles();
      }
    });
    
  }

  return roles;
}


export function saveRolesLocalStorage(roles : any) {
  if(roles && Object.keys(roles).length !== 0) {
    localStorage.setItem('roles', JSON.stringify(roles));
  }
}

export function removeRolesLocalStorage() {
  localStorage.removeItem('roles');
}

export function getRolesFromLocalStorage() {
  return localStorage.getItem('roles') ? JSON.parse(localStorage.getItem('roles') as string) : null;
}


function isAdminRole(role : Roles) {
  return role != null && role.id == '00000000-0000-0000-0000-000000000001';
}
