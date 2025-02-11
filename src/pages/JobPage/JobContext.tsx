import { createContext } from "react";

export type JobContextType = {
    job: Job;

    editing: boolean;
    setEditing(b: boolean): void;

    refresh(): Promise<JobContextType | undefined>;
};

export const JobContext = createContext<JobContextType | undefined>(undefined);
