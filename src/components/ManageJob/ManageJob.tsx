import { Job } from "@/types/Job";

import { FormInputs, UniversiForm } from "@/components/UniversiForm";
import UniversimeApi from "@/services/UniversimeApi";
import { Institution } from "@/types/Institution";
import { useEffect, useState } from "react";
import { CompetenceType } from "@/types/Competence";

export type ManageJobsProps = {
    job: Job | null;
    callback?(): any;
};

export function ManageJob(props: Readonly<ManageJobsProps>) {
    const { job, callback } = props;

    const [institutions, setInstitutions] = useState<Institution[]>();
    const [competenceTypes, setCompetenceTypes] = useState<CompetenceType[]>();

    useEffect(() => {
        updateInstitutions();
        updateCompetenceTypes();
    }, [props]);

    if (institutions === undefined || competenceTypes === undefined)
        return null;

    const isCreating = job === null;
    const req = isCreating ? UniversimeApi.Job.create : UniversimeApi.Job.update;
    const title = isCreating ? "Criar vaga" : "Editar vaga";

    return <UniversiForm
        formTitle={ title }
        objects={[
            {
                DTOName: "jobId", label: "Id", type: FormInputs.HIDDEN, value: job?.id,
            },
            {
                DTOName: "title", label: "Título", type: FormInputs.TEXT,
                value: job?.title, required: true,
                charLimit: 100, renderCharCounter: true,
            }, {
                DTOName: "shortDescription", label: "Resumo", type: FormInputs.TEXT,
                value: job?.shortDescription, required: true,
                renderCharCounter: true, charLimit: 255,
            }, {
                DTOName: "longDescription", label: "Descrição", type: FormInputs.FORMATED_TEXT,
                value: job?.longDescription, required: true,
            }, {
                DTOName: "institutionId", label: "Instituição ofertante",
                type: isCreating ? FormInputs.SELECT_SINGLE : FormInputs.HIDDEN,
                required: isCreating, value: undefined,
                canCreate: true, onCreate: handleCreateInstitution,
                options: institutions.map(makeInstitutionOption),
            }, {
                DTOName: "requiredCompetencesIds", label: "Competências necessárias", type: FormInputs.SELECT_MULTI,
                required: true, value: job?.requiredCompetences.map(makeCompetenceOption),
                canCreate: true, onCreate: handleCreateCompetenceType,
                options: competenceTypes.map(makeCompetenceOption),
            },
        ]}
        requisition={ req }
        callback={ callback }
    />

    function makeInstitutionOption(institution: Institution) {
        return {
            label: institution.name,
            value: institution.id,
        };
    }

    function makeCompetenceOption(competence: CompetenceType) {
        return {
            label: competence.name,
            value: competence.id,
        };
    }

    async function handleCreateInstitution(name: string){
        const response = await UniversimeApi.Institution.create({ name: name });
        if (!response.success) return [];

        const listResponse = await UniversimeApi.Institution.listAll();
        if (!listResponse.success) return [];

        return listResponse.body.list.map(makeInstitutionOption);
    }

    async function updateInstitutions() {
        const res = await UniversimeApi.Institution.listAll();
        if (res.success)
            setInstitutions(res.body.list);

        return res.body?.list;
    }

    async function handleCreateCompetenceType(name: string){
        const response = await UniversimeApi.CompetenceType.create({ name: name });
        if (!response.success) return [];

        const listResponse = await updateCompetenceTypes();

        return listResponse?.map(makeCompetenceOption);
    }

    async function updateCompetenceTypes() {
        const res = await UniversimeApi.CompetenceType.list();
        if (res.success)
            setCompetenceTypes(res.body.list);

        return res.body?.list;
    }
}
