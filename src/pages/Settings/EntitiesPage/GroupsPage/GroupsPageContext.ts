import { createContext } from "react";

export const GroupsPageContext = createContext<Optional<GroupsPageContextType>>( undefined );

export type GroupsPageContextType = {
    groupTypes: Group.Type[];

    refreshContext(): Promise<unknown>;
    setEdit: React.Dispatch<React.SetStateAction<Possibly<Group.Type>>>;
};
