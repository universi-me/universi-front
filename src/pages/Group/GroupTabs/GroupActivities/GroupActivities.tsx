import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import DOMPurify from "dompurify";

import { UniversimeApi } from "@/services";
import UniversiForm from "@/components/UniversiForm";
import ActionButton from "@/components/ActionButton";
import RenderCompetenceType from "@/components/RenderCompetenceType";
import BootstrapIcon from "@/components/BootstrapIcon";
import { ManageActivity } from "@/components/ManageActivity/ManageActivity";
import DropdownOptions from "@/components/DropdownOptions";
import LoadingSpinner from "@/components/LoadingSpinner";
import useCanI from "@/hooks/useCanI";
import { groupImageUrl } from "@/utils/apiUtils";
import { ArrayChanges, groupArray } from "@/utils/arrayUtils";
import { OptionInMenu } from "@/utils/dropdownMenuUtils";
import { Permission } from "@/utils/roles/rolesUtils";
import { makeClassName } from "@/utils/tsxUtils";
import { dateWithoutTimezone } from "@/utils/dateUtils";
import * as SwalUtils from "@/utils/sweetalertUtils";
import { ProfileClass, ProfileSelect } from "@/types/Profile";
import { ActivityStatusArrayObject, ActivityStatusObjects, ActivityStatusSelect, ActivityTypeSelect } from "@/types/Activity";

import { GroupContext } from "../../GroupContext";
import styles from "./GroupActivities.module.less";


const GroupActivitiesContext = createContext<Possibly<GroupActivitiesContextType>>( undefined );

export function GroupActivities() {
    const groupContext = useContext( GroupContext );
    const canI = useCanI();

    const [ activities, setActivities ] = useState( groupContext?.activities );
    const [ activityTypes, setActivityTypes ] = useState<Activity.Type[]>();

    const [ editActivity, setEditActivity ] = useState<Possibly<Activity.DTO>>();
    const [ isLoading, setIsLoading ] = useState( false );

    const [ showFilterForm, setShowFilterForm ] = useState( false );
    const filter = useRef<FilterActivitiesForm["body"]>();

    const contextValue: GroupActivitiesContextType = useMemo( () => ({
        setEditActivity,
        setIsLoading,
    }), [ ] );

    useEffect( () => {
        loadActivityTypes();
    }, [] );

    if ( !groupContext || activities === undefined || activityTypes === undefined )
        return null;

    const groupedActivities = groupArray( activities, a => a.status );

    return <GroupActivitiesContext.Provider value={ contextValue }>
        <section id="activities" className="group-tab">
            <div className="heading top-container">
                <div className="go-right">
                    <button className={ styles.filter_button } onClick={ () => setShowFilterForm( true ) }>
                        <BootstrapIcon icon="filter-circle-fill" />
                    </button>

                    { canI( "GROUP", Permission.READ_WRITE, groupContext.group ) && <ActionButton
                        name="Criar"
                        buttonProps={{ onClick(){ setEditActivity( null ) } }}
                    /> }
                </div>
            </div>

            <div id="activities-list" className={`tab-list ${ styles.groups }`}>
                { activities.length === 0
                    ? <p className="empty-list">Nenhuma atividade encontrada</p>
                    : <>
                        <RenderActivityGroup activities={ groupedActivities.get( "STARTED" ) } group="STARTED" />
                        <RenderActivityGroup activities={ groupedActivities.get( "NOT_STARTED" ) } group="NOT_STARTED" />
                        <RenderActivityGroup activities={ groupedActivities.get( "ENDED" ) } group="ENDED" />
                    </>
                }
            </div>

            { editActivity !== undefined && <ManageActivity
                activity={ editActivity }
                group={ groupContext.group }
                callback={ async res => {
                    if ( res?.isSuccess() )
                        await groupContext.refreshData();

                    setEditActivity( undefined );
                } }
            /> }
        </section>

        { isLoading && <LoadingSpinner /> }
        { showFilterForm && <UniversiForm.Root title="Filtrar Atividades" callback={ handleFilterForm }>
            <ActivityTypeSelect
                param="type"
                label="Tipo da Atividade"
                options={ activityTypes }
                defaultValue={ filter.current?.type }
                isClearable
            />

            <ActivityStatusSelect
                param="status"
                label="Estado Atual"
                defaultValue={ filter.current?.status }
            />
        </UniversiForm.Root> }
    </GroupActivitiesContext.Provider>;

    async function loadActivityTypes() {
        if ( !groupContext ) return;

        const res = await UniversimeApi.ActivityType.list();
        if ( res.isSuccess() )
            setActivityTypes( res.body );
    }

    async function handleFilterForm( form: FilterActivitiesForm ) {
        if ( form.confirmed ) {
            setIsLoading( true );

            filter.current = {
                type: form.body.type,
                status: form.body.status,
            };

            const res = await UniversimeApi.Activity.list( {
                group: groupContext!.group.id!,
                type: form.body.type?.id,
                status: form.body.status?.status,
            } );

            if ( res.isSuccess() )
                setActivities( res.body );

            setIsLoading( false );
        }

        setShowFilterForm( false );
    }
}

function RenderActivityGroup( props: Readonly<RenderActivityGroupProps> ) {
    if ( props.activities === undefined )
        return null;

    return <div>
        <h3 className={ styles.group_title }>{ ActivityStatusObjects[ props.group ].label }</h3>
        <div className={ styles.list }>
            { props.activities.map( a => <RenderActivity activity={ a } key={ a.id } /> ) }
        </div>
    </div>;
}

function RenderActivity( props: Readonly<RenderActivityProps> ) {
    const { activity } = props;

    const groupContext = useContext( GroupContext );
    const context = useContext( GroupActivitiesContext );
    const canI = useCanI();

    const [ isExpanded, setIsExpanded ] = useState( false );
    const [ isChangingParticipants, setIsChangingParticipants ] = useState( false );
    const options = useMemo( makeOptions, [] );

    if ( !groupContext || !context )
        return null;

    const groupHref = `/group${activity.group.path}`;

    return <div className={ styles.item }>
        <div className={ styles.info }>
            <Link to={ groupHref } className={ styles.image }>
                <img src={ groupImageUrl( activity.group ) } alt=""/>
            </Link>

            <div>
                <Link to={ groupHref } className={ styles.link }>
                    <h3 className={ styles.title }>{ activity.group.name } ({ activity.workload }h)</h3>
                </Link>
                <p className={ styles.type }>{ activity.type.name }</p>
                <p className={ styles.location }>Local: { activity.location }</p>
                <p className={ styles.date }>Data: { formatDate( activity.startDate, activity.endDate ) }</p>

                { activity.badges.length >0 && <p className={ styles.badges_wrapper }>
                    { activity.badges.map( ct => <RenderCompetenceType
                        competenceType={ ct }
                        key={ activity.id }
                        className={ styles.badge_item }
                    /> ) }
                </p> }
            </div>

            <div className={ styles.interactions }>
                <button onClick={ toggleExpansion } className={ makeClassName( styles.expand_button, isExpanded && styles.expanded ) }>
                    <BootstrapIcon icon="chevron-down" />
                </button>

                <DropdownOptions
                    data={ activity }
                    options={ options }
                    trigger={ <BootstrapIcon
                        className={ styles.options_button }
                        icon="three-dots-vertical"
                    /> }
                />
            </div>
        </div>

        { isExpanded && <div
            className={ styles.description }
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize( activity.group.description ?? "" ) }}
        /> }

        { isChangingParticipants && <ChangeActivityParticipants
            activity={ activity }
            callback={ async form => {
                if ( form.confirmed ) {
                    const changes = ArrayChanges.from( form.body.initial, form.body.participants, ( p1, p2 ) => p1.id === p2.id );

                    await UniversimeApi.GroupParticipant.changeParticipants( activity.group.id!, {
                        add: changes.added.map( p => ( { profile: p.id } ) ),
                        remove: changes.removed.map( p => p.id ),
                    } );
                }

                setIsChangingParticipants( false );
            } }
        /> }
    </div>

    function formatDate( start: string, end?: string ): string {
        if ( end === undefined || start === end )
            return dateWithoutTimezone( start ).toLocaleDateString( "pt-BR" );

        else
            return `${ formatDate( start ) } – ${ formatDate( end ) }`
    }

    function toggleExpansion() { setIsExpanded( e => !e ); }
    function makeOptions(): OptionInMenu<Activity.DTO>[] {
        return [
            {
                text: "Editar",
                biIcon: "pencil-fill",
                hidden( activity ) {
                    return !activity.group.canEdit;
                },
                onSelect( activity ) {
                    context?.setEditActivity( activity );
                },
            }, {
                text: "Alterar participantes",
                biIcon: "people-fill",
                hidden( activity ) {
                    return !canI( "PEOPLE", Permission.READ_WRITE_DELETE, activity.group );
                },
                onSelect(){
                    setIsChangingParticipants( true );
                }
            }, {
                text: "Deletar",
                biIcon: "trash-fill",
                className: styles.delete_option,
                hidden( activity ) {
                    return activity.group.role?.roleType === "ADMINISTRATOR";
                },
                async onSelect( activity ) {
                    const isSure = await SwalUtils.fireAreYouSure({
                        title: "Deseja excluir esta Atividade?",
                        text: "Esta ação não poderá ser desfeita.",

                        confirmButtonText: "Excluir",
                        confirmButtonColor: "var(--wrong-invalid-color)",

                        cancelButtonText: "Cancelar",
                    });
                    if ( !isSure.isConfirmed ) return;

                    context?.setIsLoading( true );
                    const res = await UniversimeApi.Activity.remove( activity.id );
                    if ( res.isSuccess() )
                        await groupContext?.refreshData();
                    context?.setIsLoading( false );
                },
            }
        ];
    }
}

function ChangeActivityParticipants( props: Readonly<ChangeActivityParticipantsProps> ) {
    const groupContext = useContext( GroupContext );
    const [ participants, setParticipants ] = useState<Profile.DTO[]>();
    useEffect( () => {
        UniversimeApi.GroupParticipant.filter( { groupId: props.activity.group.id, competences: [], matchEveryCompetence: false } )
        .then( participants => {
            setParticipants( participants.body ?? [] );
        } )
    }, [ props.activity.id ] );

    if ( participants === null )
        return <LoadingSpinner />

    return <UniversiForm.Root title={ "Alterar Participantes" } callback={ props.callback }>
        <ProfileSelect
            param="participants"
            label="Participantes"
            isSearchable
            defaultValue={ participants }
            options={ groupContext!.participants }
            validations={ [
                value => ArrayChanges.from( participants, value, ( p1, p2 ) => p1.id === p2.id ).hasChanges,
            ] }
        />

        <UniversiForm.Input.Hidden
            param="initial"
            defaultValue={ participants }
        />
    </UniversiForm.Root>;
}

type FilterActivitiesForm = UniversiForm.Data<{
    type?: Activity.Type;
    status?: ActivityStatusArrayObject;
}>;

type RenderActivityGroupProps = {
    activities: Optional<Activity.DTO[]>;
    group: Activity.Status;
};

type RenderActivityProps = {
    activity: Activity.DTO;
};

type GroupActivitiesContextType = {
    setEditActivity( action: React.SetStateAction<Possibly<Activity.DTO>> ): unknown;
    setIsLoading( action: React.SetStateAction<boolean> ): unknown;
};

type ChangeActivityParticipantsProps = {
    activity: Activity.DTO;
    callback( form: ChangeActivityParticipantsForm ): unknown;
};

type ChangeActivityParticipantsForm = UniversiForm.Data<{
    participants: ProfileClass[];
    initial?: Profile.DTO[];
}>;
