import { createContext } from "react";
import { Group } from "@/types/Group";
import { Profile } from "@/types/Profile";

export type GroupContextType = null | {
    group:         Group;
    subgroups:     Group[];
    participants:  Profile[];
    isParticipant: boolean;

    reloadPage: () => any;
};

export const GroupContext = createContext<GroupContextType>(null);
