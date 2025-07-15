import { useEffect, useRef, useState } from "react";
import { UniversimeApi } from "@/services";
import UniversiForm from "@/components/UniversiForm";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ApiResponse, groupBannerUrl, groupImageUrl } from "@/utils/apiUtils";
import { getDate } from "@/utils/dateUtils";
import { ActivityTypeSelect } from "@/types/Activity";
import { CompetenceTypeSelect } from "@/types/Competence";
import { RolesPermissionForm, RolesPermissionsFormPage } from "./RolesPermissionsFormPage";

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

    const [ availableGroupTypes, setAvailableGroupTypes ] = useState<Group.Type[]>();
    useEffect( () => {
        UniversimeApi.GroupType.list()
        .then( res => {
            if ( res.isSuccess() )
                setAvailableGroupTypes( res.body );
        } )
    }, [] );

    const [ step, setStep ] = useState<ManageActivityFormSteps>( "ACTIVITY" );
    const formSavedData = useRef<Partial<ManageActivityForm>>( {
        name: activity?.group.name,
        type: activity?.type,
        description: activity?.group.description,
        location: activity?.location,
        workload: activity?.workload ?? undefined,
        badges: activity?.badges,
        startDate: getDate( activity?.startDate ),
        endDate: getDate( activity?.endDate ),
        image: activity?.group && groupImageUrl( activity.group ),
        bannerImage: activity?.group && groupBannerUrl( activity.group ),
    } );
    const rolesFormSavedData = useRef<Partial<RolesPermissionForm>>( { } );

    const isCreating = props.activity === null;
    const title = isCreating ? "Criar Atividade" : "Editar Atividade";

    if ( availableActivityTypes === undefined || availableCompetenceTypes === undefined || availableGroupTypes === undefined )
        return <LoadingSpinner />

    return <>{ step === "ACTIVITY" &&
    <UniversiForm.Root title={ title }
        callback={ handleForm }
        confirmButton={ {
            text: isCreating ? "Avançar" : undefined,
            biIcon: isCreating ? "arrow-right-circle-fill" : undefined,
        } }
    >
        <UniversiForm.Input.Text
            param="name"
            label="Título"
            placeholder="Título da Atividade"
            defaultValue={ formSavedData.current.name }
            required
        />

        <ActivityTypeSelect
            param="type"
            label="Tipo da Atividade"
            defaultValue={ formSavedData.current.type }
            options={ availableActivityTypes }
            placeholder="Selecione o Tipo da Atividade"
            required
        />

        <UniversiForm.Input.FormattedText
            param="description"
            label="Descrição"
            placeholder="Descrição da Atividade"
            defaultValue={ formSavedData.current.description }
            required
        />

        <UniversiForm.Input.Text
            param="location"
            label="Local"
            defaultValue={ formSavedData.current.location }
            placeholder="Local onde ocorrerá a Atividade"
            required
        />

        <UniversiForm.Input.Number
            param="workload"
            label="Carga Horária"
            defaultValue={ formSavedData.current.workload }
            placeholder="Carga horária da Atividade"
            validations={ [
                workload => isNaN( workload ) || workload > 0,
            ] }
        />

        <CompetenceTypeSelect
            param="badges"
            label="Competências Relacionadas"
            options={ availableCompetenceTypes }
            defaultValue={ formSavedData.current.badges }
            isMultiSelection
        />

        <UniversiForm.Input.Date
            param="startDate"
            label="Data de Início"
            defaultValue={ formSavedData.current.startDate }
            required
        />

        <UniversiForm.Input.Date
            param="endDate"
            label="Data de Término"
            defaultValue={ formSavedData.current.endDate }
            required
            help="Para Atividades que durem apenas um dia, coloque a mesma data que pôs no campo anterior."
            validations={ [
                ( endDate, form ) => {
                    const startDate = form.startDate as Optional<Date>;
                    return !!endDate && !!startDate && ( endDate >= startDate );
                }
            ] }
        />

        <UniversiForm.Input.Hidden
            param="group"
            defaultValue={ group }
        />

        <UniversiForm.Input.Image
            param="image"
            label={ "Imagem da Atividade" }
            aspectRatio={ 1 }
            defaultValue={ formSavedData.current.image }
        />

        <UniversiForm.Input.Image
            param="bannerImage"
            label={ "Banner da Atividade" }
            aspectRatio={ 2.5 }
            defaultValue={ formSavedData.current.bannerImage }
        />

    </UniversiForm.Root>
    }

    { step === "ROLES" && <RolesPermissionsFormPage
        activitySaveData={ formSavedData.current as ManageActivityForm }
        saveData={ rolesFormSavedData }
        setStep={ setStep }
        callback={ callback }
    /> }
    </>;

    async function handleForm( form: UniversiForm.Data<ManageActivityForm<typeof isCreating>> ) {
        if ( !form.confirmed )
            return callback();

        if ( isCreating ) {
            formSavedData.current = form.body;
            setStep( "ROLES" );
            return;
        }

        const image = form.body.image instanceof File
            ? await UniversimeApi.Image.upload( { isPublic: true, image: form.body.image } )
            : undefined;

        const bannerImage = form.body.bannerImage instanceof File
            ? await UniversimeApi.Image.upload( { isPublic: true, image: form.body.bannerImage } )
            : undefined;

        const res = await UniversimeApi.Activity.update( activity!.id, {
            name: form.body.name,
            description: form.body.description,
            type: form.body.type.id,
            location: form.body.location,
            workload: form.body.workload,
            startDate: form.body.startDate.getTime(),
            endDate: form.body.endDate.getTime(),
            badges: form.body.badges?.map( ct => ct.id ),
            image: image?.body,
            bannerImage: bannerImage?.body,
        } );

        return callback?.( res );
    }
}

export type ManageActivityProps = {
    activity: Nullable<Activity.DTO>;
    group: Group.DTO;
    callback( res?: ApiResponse<Activity.DTO> ): unknown;
};

export type ManageActivityForm<IsCreating extends boolean = boolean> = {
    name: string;
    description: string;
    type: Activity.Type;
    location: string;
    workload: number;
    startDate: Date;
    endDate: Date;
    badges: Optional<Competence.Type[]>;
    group: Group.DTO;

    image: IsCreating extends true ? Optional<File | string> : undefined;
    bannerImage: IsCreating extends true ? Optional<File | string> : undefined;
};

export type ManageActivityFormSteps = "ACTIVITY" | "ROLES";
