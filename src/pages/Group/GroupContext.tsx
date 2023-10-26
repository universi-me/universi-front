import { createContext } from "react";
import { Group } from "@/types/Group";
import { Profile } from "@/types/Profile";
import { Folder } from "@/types/Capacity";

export type GroupContextType = null | {
    group:         Group;
    subgroups:     Group[];
    participants:  Profile[];
    folders:       Folder[];

    currentContent: Folder | undefined;
    setCurrentContent(content: Folder | undefined): any;

    loggedData: {
        isParticipant: boolean;
        profile:       Profile;
        groups:        Group[];
    };

    refreshData: () => Promise<any>;
};

export const GroupContext = createContext<GroupContextType>(null);
