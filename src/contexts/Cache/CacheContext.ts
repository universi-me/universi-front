import { createContext } from "react";
import type { CacheHandler } from "./CacheProvider";

export const REFRESH_RATE_IN_MS = 120_000; // 2min
export const CacheContext = createContext<CacheContextType>( undefined! );

export type CacheContextType = {
    readonly ActivityType: CacheHandler<Activity.Type[]>;
    readonly CompetenceType: CacheHandler<Competence.Type[]>;
    // readonly EducationType: CacheHandler<Education.Type[]>;
    // readonly ExperienceType: CacheHandler<Experience.Type[]>;
    readonly GroupType: CacheHandler<Group.Type[]>;
    readonly Institution: CacheHandler<Institution.DTO[]>;
};
