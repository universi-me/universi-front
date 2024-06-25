import { useContext } from "react";
import DOMPurify from "dompurify";

import { Job } from "@/types/Job";

import { JobContext } from "@/pages/JobPage";

export function JobShortDescription(props : Readonly<JobTextProps>) {
    const context = useContext(JobContext);
    const job = props.job ?? context?.job;
    if (!job) return null;

    return <p id="job-short-description">
        <strong>Resumo:</strong> { job.shortDescription }
    </p>
}

export function JobLongDescription(props : Readonly<JobTextProps>) {
    const context = useContext(JobContext);
    const job = props.job ?? context?.job;
    if (!job) return null;

    return <div id="job-long-description">
        <h3 id="job-long-description-header">Descrição da vaga</h3>
        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(job.longDescription) }} />
    </div>
}

export type JobTextProps = {
    job?: Job;
};
