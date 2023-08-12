import { Group } from "@/types/Group";
import { createContext } from "react";

export type GroupContextType = null | {
    group: Group;
    subgroups: Group[];
};

export const GroupContext = createContext<GroupContextType>(null);
