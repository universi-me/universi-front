import { useContext } from "react";
import DOMPurify from "dompurify";

import { Job } from "@/types/Job";

import { JobContext } from "@/pages/JobPage";

export function JobShortDescription(props : Readonly<JobTextProps>) {
    const context = useContext(JobContext);
    const job = props.job ?? context?.job;
    if (!job) return null;

    return <p id="job-short-description">
        { job.shortDescription }
    </p>
}

export function JobLongDescription(props : Readonly<JobTextProps>) {
    const context = useContext(JobContext);
    const job = props.job ?? context?.job;
    if (!job) return null;

    return <div id="job-long-description" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(job.longDescription) }} />
}

export type JobTextProps = {
    job?: Job;
};
