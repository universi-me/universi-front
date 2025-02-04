import { useContext } from "react";

import { UniversimeApi } from "@/services"
import ActionButton from "@/components/ActionButton";
import * as SwalUtils from "@/utils/sweetalertUtils";
import { Job } from "@/types/Job";

import { JobContext } from "@/pages/JobPage";

export function JobActions( props : Readonly<JobActionsProps> ) {
    const context = useContext(JobContext);
    const job = props.job ?? context?.job;
    if (!job) return null;

    return <div id="job-actions">
        { !job.closed && job.author.user.ownerOfSession &&
            <ActionButton name="Editar" biIcon="pencil-fill" buttonProps={{ onClick: handleEdit}} />
        }

        { !job.closed && job.author.user.ownerOfSession &&
            <ActionButton name="Fechar vaga" biIcon="check-circle-fill" buttonProps={{ onClick: handleClose }} />
        }
    </div>

    function handleEdit() {
        context?.setEditing(true);
    }

    async function handleClose() {
        const res = await SwalUtils.fireAreYouSure({
            title: "Deseja fechar a vaga?",
            confirmButtonText: "Fechar vaga",
        });

        if (res.isConfirmed) {
            await UniversimeApi.Job.close({ jobId: job!.id });
            await context?.refresh();
        }
    }
}

export type JobActionsProps = {
    job?: Job;
};
