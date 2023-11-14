import { createContext } from "react";
import { Group } from "@/types/Group";
import { Profile } from "@/types/Profile";
import { Folder } from "@/types/Capacity";
import { Link } from "@/types/Link";

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
        links:         Link[];
        groups:        Group[];
    };

    refreshData: () => Promise<NonNullable<GroupContextType>>;
};

export const GroupContext = createContext<GroupContextType>(null);
