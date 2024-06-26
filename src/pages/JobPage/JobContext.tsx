import { createContext } from "react";
import { Job } from "@/types/Job";

export type JobContextType = {
    job: Job;

    editing: boolean;
    setEditing(b: boolean): void;

    refresh(): Promise<JobContextType | undefined>;
};

export const JobContext = createContext<JobContextType | undefined>(undefined);
