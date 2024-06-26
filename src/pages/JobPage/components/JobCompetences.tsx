import { useContext, useMemo } from "react";

import BootstrapIcon from "@/components/BootstrapIcon";
import { CompetenceType } from "@/types/Competence";
import { Job } from "@/types/Job";

import { JobContext } from "@/pages/JobPage";

export function JobCompetences(props : Readonly<JobCompetencesProps>) {
    const context = useContext(JobContext);
    const job = props.job ?? context?.job;

    const competences = useMemo(() => {
        if (!job) return undefined;

        return [...job.requiredCompetences].sort((a, b) => a.name.localeCompare(b.name))
    }, [job?.requiredCompetences]);

    if (!competences || competences.length === 0)
        return null;

    return <div id="job-competences">
        Competências necessárias:
        { competences.map(c => <RenderCompetence competence={c} key={c.id} />) }
    </div>
}

export type JobCompetencesProps = {
    job?: Job;
};


function RenderCompetence(props : Readonly<RenderCompetenceProps>) {
    const { competence } = props;

    const title = competence.reviewed
        ? "Esta competência não foi revisada por um administrador e não é visível publicamente"
        : undefined;

    return <span className="job-requirement" title={ title }>
        { competence.name }
        { competence.reviewed ||
            <BootstrapIcon icon="exclamation-diamond-fill" className="unreviewed-competence-warning" />
        }
    </span>
}

type RenderCompetenceProps = {
    competence: CompetenceType;
};
