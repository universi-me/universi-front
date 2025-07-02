import { useEffect, useState } from "react";

import useCache from "@/contexts/Cache";
import { UniversimeApi } from "@/services";
import UniversiForm, { UniversiFormStyles } from "@/components/UniversiForm";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ApiResponse } from "@/utils/apiUtils";
import { ActivityTypeSelect } from "@/types/Activity";
import { CompetenceTypeSelect } from "@/types/Competence";
import { GroupTypeSelect } from "@/types/Group";
import { isValidUsernamePattern } from "@/types/Profile";

export function ManageActivity( props: Readonly<ManageActivityProps> ) {
    const { activity, group, callback } = props;
    const cache = useCache();

    const [ availableActivityTypes, setAvailableActivityTypes ] = useState<Activity.Type[]>();
    useEffect( () => {
        cache.ActivityType.get()
        .then( setAvailableActivityTypes );
    }, [] );

    const [ availableCompetenceTypes, setAvailableCompetenceTypes ] = useState<Competence.Type[]>();
    useEffect( () => {
        cache.CompetenceType.get()
        .then( setAvailableCompetenceTypes );
    }, [] );

    const [ availableGroupTypes, setAvailableGroupTypes ] = useState<Group.Type[]>();
    useEffect( () => {
        cache.GroupType.get()
        .then( setAvailableGroupTypes );
    }, [] );

    const isCreating = props.activity === null;
    const title = isCreating ? "Criar Atividade" : "Editar Atividade";

    if ( availableActivityTypes === undefined || availableCompetenceTypes === undefined || availableGroupTypes === undefined )
        return <LoadingSpinner />

    return <UniversiForm.Root title={ title } callback={ handleForm }>
        <UniversiForm.Input.Text
            param="name"
            label="Título"
            placeholder="Título da Atividade"
            defaultValue={ activity?.group.name }
            disabled={ activity !== null }
            help={ activity && "Para alterar o título desta atividade, entre no grupo associado e altere o título daquele grupo." }
            required
        />

        <ActivityTypeSelect
            param="type"
            label="Tipo da Atividade"
            defaultValue={ activity?.type }
            options={ availableActivityTypes }
            placeholder="Selecione o Tipo da Atividade"
            required
        />

        <UniversiForm.Input.FormattedText
            param="description"
            label="Descrição"
            placeholder="Descrição da Atividade"
            defaultValue={ activity?.group.description }
            disabled={ activity !== null }
            help={ activity && "Para alterar a descrição desta atividade, entre no grupo associado e altere a descrição daquele grupo." }
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
            help="Para Atividades que durem apenas um dia, coloque a mesma data que pôs no campo anterior."
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

            <UniversiForm.Input.Text
                param="nickname"
                label="Apelido"
                required
                placeholder="Apelido do Grupo"
                help="Você só pode usar letras minúsculas, números, hífen (-), underscore (_) e ponto (.)."
                validations={ [
                    isValidUsernamePattern
                ] }
            />

            <GroupTypeSelect
                param="groupType"
                label="Tipo"
                options={ availableGroupTypes }
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
            type: form.body.type.id,
            location: form.body.location,
            workload: form.body.workload,
            startDate: form.body.startDate.getTime(),
            endDate: form.body.endDate.getTime(),
            badges: form.body.badges?.map( ct => ct.id ),
        };

        const res = isCreating
            ? await UniversimeApi.Activity.create( {
                ...body,
                name: form.body.name,
                description: form.body.description,
                group: group.id!,
                groupType: form.body.groupType!.id,
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
    badges: Optional<Competence.Type[]>;

    nickname: IsCreating extends true ? string : undefined;
    groupType: IsCreating extends true ? Group.Type : undefined;
    image: IsCreating extends true ? Optional<File | string> : undefined;
    bannerImage: IsCreating extends true ? Optional<File | string> : undefined;
};
