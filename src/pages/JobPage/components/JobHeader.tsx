import { useContext } from "react";

import BootstrapIcon from "@/components/BootstrapIcon";
import { Job } from "@/types/Job";

import { JobContext } from "@/pages/JobPage";

export function JobHeader(props: Readonly<JobHeaderProps>) {
    const context = useContext(JobContext);
    const job = props.job ?? context?.job;
    if (!job) return null;

    return <div id="job-header">
        { job.closed &&
            <h2 id="job-closed-message">
                <BootstrapIcon icon="check-circle-fill"/> Essa vaga já foi fechada
            </h2>
        }

        <h2 id="job-title">{ job.title }</h2>
        <h3 id="job-institution">Ofertante: { job.institution.name }</h3>
    </div>
}

export type JobHeaderProps = {
    job?: Job;
};
