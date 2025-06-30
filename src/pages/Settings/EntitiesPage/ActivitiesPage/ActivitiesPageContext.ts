import { createContext } from "react";

export const ActivitiesPageContext = createContext<Optional<ActivitiesPageContextType>>( undefined );

export type ActivitiesPageContextType = {
    activityTypes: Activity.Type[];

    refreshContext(): Promise<unknown>;
    setEdit: React.Dispatch<React.SetStateAction<Possibly<Activity.Type>>>;
};
