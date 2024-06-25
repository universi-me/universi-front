import { createContext } from "react";
import { Job } from "@/types/Job";

export type JobContextType = {
    job: Job;
};

export const JobContext = createContext<JobContextType | undefined>(undefined);
