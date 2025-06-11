import { useEffect, useState } from "react";
import { UniversimeApi } from "@/services";
import UniversiForm, { UniversiFormStyles } from "@/components/UniversiForm";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ApiResponse } from "@/utils/apiUtils";
import { ActivityTypeSelect } from "@/types/Activity";
import { CompetenceTypeSelect } from "@/types/Competence";
import { GroupTypeArrayObject, GroupTypeSelect } from "@/types/Group";
import { isValidUsernamePattern } from "@/types/Profile";

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
            placeholder="Título da Atividade"
            defaultValue={ activity?.group.name }
            required
        />

        <UniversiForm.Input.FormattedText
            param="description"
            label="Descrição"
            placeholder="Descrição da Atividade"
            defaultValue={ activity?.group.description }
            required
        />

        <ActivityTypeSelect
            param="type"
            label="Tipo"
            defaultValue={ activity?.type }
            options={ availableActivityTypes }
            placeholder="Selecione o Tipo da Atividade"
            required
        />

        <UniversiForm.Input.Text
            param="location"
            label="Local"
            defaultValue={ activity?.location }
            placeholder="Local onde ocorrerá a Atividade"
            required
        />

        <UniversiForm.Input.Number
            param="workload"
            label="Carga Horária"
            defaultValue={ activity?.workload }
            required
            placeholder="Carga horária da Atividade"
            validations={ [
                workload => workload > 0,
            ] }
        />

        <CompetenceTypeSelect
            param="badges"
            label="Competências Relacionadas"
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

        { isCreating && <>
            <hr/>
            <div className={ UniversiFormStyles.fieldset }>
                <legend className={ UniversiFormStyles.legend }>Dados do grupo</legend>
                <p>
                    Ao criar uma atividade será criado junto a ela um grupo associado,
                    que será usado para gerenciar os participantes, conteúdos, feed entre outros.
                    Preencha os dados necessários para o grupo.
                </p>
            </div>

            <div>
                <UniversiForm.Input.Text
                    param="nickname"
                    label="Apelido"
                    required
                    placeholder="Apelido do Grupo"
                    validations={ [
                        isValidUsernamePattern
                    ] }
                />
                <p>Você só pode usar letras minúsculas, números, hífen (-), underscore (_) e ponto (.).</p>
            </div>

            <GroupTypeSelect
                param="groupType"
                label="Tipo"
                placeholder="Tipo do Grupo"
                required
            />

            <UniversiForm.Input.Image
                param="image"
                label={ "Imagem do Grupo" }
                aspectRatio={ 1 }
            />

            <UniversiForm.Input.Image
                param="bannerImage"
                label={ "Banner do Grupo" }
                aspectRatio={ 2.5 }
            />
        </> }

    </UniversiForm.Root>

    async function handleForm( form: UniversiForm.Data<ManageActivityForm<typeof isCreating>> ) {
        if ( !form.confirmed )
            return callback();

        const image = form.body.image instanceof File
            ? await UniversimeApi.Image.upload( { isPublic: true, image: form.body.image } )
            : undefined;

        const bannerImage = form.body.bannerImage instanceof File
            ? await UniversimeApi.Image.upload( { isPublic: true, image: form.body.bannerImage } )
            : undefined;

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
            ? await UniversimeApi.Activity.create( {
                ...body,
                group: group.id!,
                groupType: form.body.groupType!.type,
                nickname: form.body.nickname!,
                image: image?.body,
                bannerImage: bannerImage?.body,
            } )
            : await UniversimeApi.Activity.update( activity!.id, body );

        return callback?.( res );
    }
}

export type ManageActivityProps = {
    activity: Nullable<Activity.DTO>;
    group: Group.DTO;
    callback( res?: ApiResponse<Activity.DTO> ): unknown;
};

type ManageActivityForm<IsCreating extends boolean> = {
    name: string;
    description: string;
    type: Activity.Type;
    location: string;
    workload: number;
    startDate: Date;
    endDate: Date;
    badges: Competence.Type[];

    nickname: IsCreating extends true ? string : undefined;
    groupType: IsCreating extends true ? GroupTypeArrayObject : undefined;
    image: IsCreating extends true ? Optional<File | string> : undefined;
    bannerImage: IsCreating extends true ? Optional<File | string> : undefined;
};
