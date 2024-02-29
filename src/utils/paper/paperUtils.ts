import UniversimeApi from "@/services/UniversimeApi";
import { FeatureTypes, Paper, PaperFeature, Permission } from "@/types/Paper";
import { Profile } from "@/types/Profile";
import { AuthContext } from "@/contexts/Auth";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Group } from "@/types/Group";
import { PaperRemove_ResponseDTO } from "@/services/UniversimeApi/Paper";


type PaperStored = null | {
  paper:         Paper | undefined;
  timestamp:     number;
};


/**
 * Check if the user has permission to do something
 * @param featureType The feature type
 * @param permission The permission, if not provided, will return number of permission of user
 * @param profile The profile
 * @param group The group
 * @returns The permission or false if the user does not have permission
 */
export function canI(featureType: FeatureTypes, permission?: Permission,  profile?: Profile, group?: Group): number | boolean {
  try {
    return canI_(featureType, permission, profile, group);
  } catch (error) {
    return false;
  }
}

function canI_(featureType: FeatureTypes, permission?: Permission,  profile?: Profile, group?: Group): number | boolean {
  const defaultPermission = Permission.DEFAULT;
  var returnValueAsBollean = (permission != null || permission != undefined);
  
  try {
    const auth = useContext(AuthContext);
    
    function getCachingKey(group?: Group, profile?: Profile) {
      return 'paper|' + (group!?.id ?? auth!?.organization!.id) + (profile!?.id ?? auth!?.profile!.id);
    } 
  
    function getCachePaper(checkTime: boolean, group?: Group, profile?: Profile) {
      try {
      let paperStore : PaperStored = JSON.parse(localStorage.getItem(getCachingKey(group, profile)) as any);
    
      // if timestamp is older than 1 min, remove cache
      if(checkTime && (paperStore!?.timestamp < Date.now() - 10000)) {
        refreshPaper();
        return getCachePaper(false, group, profile);
      }
      return paperStore?.paper;

    } catch (error) {
    }
    }
  
    function setCachePaper(group?: Group, profile?: Profile, paper?: Paper) {
      if(!paper) {
        return;
      }
      let paperStore : PaperStored = {
        paper: paper,
        timestamp: Date.now()
      };
      localStorage.setItem(getCachingKey(group, profile), JSON.stringify(paperStore));
    }

    function removeCachePaper(group?: Group, profile?: Profile) {
      localStorage.removeItem(getCachingKey(group, profile));
    }

    function refreshPaper() {
      UniversimeApi.Paper.assigned({groupId: group!?.id ?? auth!?.organization?.id, profileId: profile!?.id ?? auth!?.profile?.id}).then(
        (response) => {
          if((response as any).body?.paper) {
            setCachePaper(group, profile, (response as any).body?.paper);
          }
        }
      );
    }

    useEffect(() => {
      try {
        if (auth!?.profile && auth!?.organization) {
          let cachedPaper : Paper | null | undefined = getCachePaper(true, group, profile);
          if(cachedPaper) {
            return;
          }
          
          refreshPaper();

        }
      } catch (error) {
      }
    }, [auth!?.profile]);



    let cachedPaper : Paper | null | undefined = getCachePaper(false, group, profile);

    if (cachedPaper) {
      const featureR: PaperFeature | undefined = cachedPaper?.paperFeatures?.findLast((f :any) => f.featureType === featureType);

      if(returnValueAsBollean) {
        return  (featureR ? (featureR.permission >= permission!)? true : false : defaultPermission>1);
      }

      return  (featureR ? featureR.permission ?? defaultPermission : defaultPermission);
    }

    return returnValueAsBollean? defaultPermission>1 : defaultPermission;

  } catch (error) {
    return returnValueAsBollean? defaultPermission>1 : defaultPermission;
  }
}




