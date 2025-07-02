import { useEffect, useState } from "react";

import useCache from "@/contexts/Cache";
import { UniversimeApi } from "@/services"
import UniversiForm from "@/components/UniversiForm";
import LoadingSpinner from "@/components/LoadingSpinner";
import { type ApiResponse } from "@/utils/apiUtils";
import { CompetenceTypeSelect } from "@/types/Competence";
import { InstitutionSelect } from "@/types/Institution";

export type ManageJobsProps = {
    job: Job | null;
    callback?( res: Optional<ApiResponse<Job.DTO>> ): any;
};

export function ManageJob(props: Readonly<ManageJobsProps>) {
    const cache = useCache();

    const { job, callback } = props;

    const [institutions, setInstitutions] = useState<Institution[]>();
    const [competenceTypes, setCompetenceTypes] = useState<CompetenceType[]>();

    useEffect(() => {
        updateInstitutions();
        updateCompetenceTypes();
    }, [props]);

    if (institutions === undefined || competenceTypes === undefined)
        return <LoadingSpinner />;

    const isCreating = job === null;
    const title = isCreating ? "Criar vaga" : "Editar vaga";

    return <UniversiForm.Root title={ title } callback={ handleForm }>
        <UniversiForm.Input.Text
            param="title"
            label="Título"
            required
            defaultValue={ job?.title }
            maxLength={ 100 }
        />

        <UniversiForm.Input.Text
            param="shortDescription"
            label="Resumo"
            required
            defaultValue={ job?.shortDescription }
            maxLength={ 255 }
        />

        <UniversiForm.Input.FormattedText
            param="longDescription"
            label="Descrição"
            defaultValue={ job?.longDescription }
            required
        />

        <InstitutionSelect
            param="institution"
            label="Instituição ofertante"
            options={ institutions }
            required
            isSearchable
            defaultValue={ job?.institution }
            disabled={ isCreating }
        />

        <CompetenceTypeSelect
            param="requiredCompetences"
            label="Competências necessárias"
            options={ competenceTypes }
            defaultValue={ job?.requiredCompetences }
            required
            isMultiSelection
            onUpdateOptions={ setCompetenceTypes }
        />
    </UniversiForm.Root>

    async function handleForm( form: ManageJobForm ) {
        if ( !form.confirmed )
            return callback?.( undefined );

        const body = {
            title: form.body.title,
            longDescription: form.body.longDescription,
            shortDescription: form.body.shortDescription,
            requiredCompetencesIds: form.body.requiredCompetences.map( ct => ct.id ),
        };

        const res = isCreating
            ? await UniversimeApi.Job.create( { ...body, institutionId: form.body.institution.id } )
            : await UniversimeApi.Job.update( job.id, body );

        return callback?.( res );
    }

    async function updateInstitutions() {
        const res = await UniversimeApi.Institution.list();
        if (res.isSuccess())
            setInstitutions(res.data);

        return res.data;
    }

    async function updateCompetenceTypes() {
        const res = await cache.CompetenceType.get();
        setCompetenceTypes( res );

        return res;
    }
}

type ManageJobForm = UniversiForm.Data<{
    title: string;
    shortDescription: string;
    longDescription: string;
    institution: Institution.DTO;
    requiredCompetences: Competence.Type[];
}>;
