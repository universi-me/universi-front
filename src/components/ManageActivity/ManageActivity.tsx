import { useEffect, useState } from "react";
import { UniversimeApi } from "@/services";
import UniversiForm from "@/components/UniversiForm";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ApiResponse } from "@/utils/apiUtils";
import { ActivityTypeSelect } from "@/types/Activity";
import { CompetenceTypeSelect } from "@/types/Competence";

export function ManageActivity( props: Readonly<ManageActivityProps> ) {
    const { activity, group, callback } = props;

    const [ availableActivityTypes, setAvailableActivityTypes ] = useState<Activity.Type[]>();
    useEffect( () => {
        UniversimeApi.ActivityType.list()
        .then( res => {
            if ( res.isSuccess() )
                setAvailableActivityTypes( res.body );
        } )
    }, [] );

    const [ availableCompetenceTypes, setAvailableCompetenceTypes ] = useState<Competence.Type[]>();
    useEffect( () => {
        UniversimeApi.CompetenceType.list()
        .then( res => {
            if ( res.isSuccess() )
                setAvailableCompetenceTypes( res.body );
        } )
    }, [] );

    const isCreating = props.activity === null;
    const title = isCreating ? "Criar Atividade" : "Editar Atividade";

    if ( availableActivityTypes === undefined || availableCompetenceTypes === undefined )
        return <LoadingSpinner />

    return <UniversiForm.Root title={ title } callback={ handleForm }>
        <UniversiForm.Input.Text
            param="name"
            label="Título"
            defaultValue={ activity?.name }
            required
        />

        <UniversiForm.Input.FormattedText
            param="description"
            label="Descrição"
            defaultValue={ activity?.description }
            required
        />

        <ActivityTypeSelect
            param="type"
            label="Tipo"
            defaultValue={ activity?.type }
            options={ availableActivityTypes }
            required
        />

        <UniversiForm.Input.Text
            param="location"
            label="Local"
            defaultValue={ activity?.location }
            required
        />

        <UniversiForm.Input.Number
            param="workload"
            label="Carga Horária"
            defaultValue={ activity?.workload }
            required
        />

        <CompetenceTypeSelect
            param="badges"
            label="Selos"
            options={ availableCompetenceTypes }
            defaultValue={ activity?.badges }
            isMultiSelection
        />

        <UniversiForm.Input.Date
            param="startDate"
            label="Data de Início"
            defaultValue={ activity?.startDate }
            required
        />

        <UniversiForm.Input.Date
            param="endDate"
            label="Data de Término"
            defaultValue={ activity?.endDate }
            required
            validations={ [
                ( endDate, form ) => {
                    const startDate = form.startDate as Optional<Date>;
                    return !!endDate && !!startDate && ( endDate >= startDate );
                }
            ] }
        />
    </UniversiForm.Root>

    async function handleForm( form: UniversiForm.Data<ManageActivityForm> ) {
        if ( !form.confirmed )
            return callback();

        const body = {
            name: form.body.name,
            description: form.body.description,
            type: form.body.type.id,
            location: form.body.location,
            workload: form.body.workload,
            startDate: form.body.startDate.getTime(),
            endDate: form.body.endDate.getTime(),
            badges: form.body.badges.map( ct => ct.id ),
        };

        const res = isCreating
            ? await UniversimeApi.Activity.create( { ...body, group: group.id! } )
            : await UniversimeApi.Activity.update( activity!.id, body );

        return callback?.( res );
    }
}

export type ManageActivityProps = {
    activity: Nullable<Activity.DTO>;
    group: Group.DTO;
    callback( res?: ApiResponse<Activity.DTO> ): unknown;
};

type ManageActivityForm = {
    name: string;
    description: string;
    type: Activity.Type;
    location: string;
    workload: number;
    startDate: Date;
    endDate: Date;
    badges: Competence.Type[];
};
