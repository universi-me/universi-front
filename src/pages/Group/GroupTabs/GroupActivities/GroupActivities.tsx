import { createContext, useContext, useEffect, useMemo, useState } from "react";
import DOMPurify from "dompurify";

import { UniversimeApi } from "@/services";
import { GroupContext } from "../../GroupContext";
import UniversiForm from "@/components/UniversiForm";
import ActionButton from "@/components/ActionButton";
import RenderCompetenceType from "@/components/RenderCompetenceType";
import BootstrapIcon from "@/components/BootstrapIcon";
import { ManageActivity } from "@/components/ManageActivity/ManageActivity";
import DropdownOptions from "@/components/DropdownOptions";
import LoadingSpinner from "@/components/LoadingSpinner";
import { SelectionChanges } from "@/components/UniversiForm/inputs/UniversiFormCardSelectionInput";
import useCanI from "@/hooks/useCanI";
import { OptionInMenu } from "@/utils/dropdownMenuUtils";
import { Permission } from "@/utils/roles/rolesUtils";
import { makeClassName } from "@/utils/tsxUtils";
import * as SwalUtils from "@/utils/sweetalertUtils";
import { ProfileSelect } from "@/types/Profile";

import styles from "./GroupActivities.module.less";


const GroupActivitiesContext = createContext<Possibly<GroupActivitiesContextType>>( undefined );

export function GroupActivities() {
    const groupContext = useContext( GroupContext );
    const canI = useCanI();

    const [ editActivity, setEditActivity ] = useState<Possibly<Activity.DTO>>();

    const contextValue: GroupActivitiesContextType = useMemo( () => ({
        editActivity,
        setEditActivity,
    }), [ editActivity ] );

    if ( groupContext?.activities === undefined )
        return null;

    const activities = groupContext.activities;

    return <GroupActivitiesContext.Provider value={ contextValue }>
        <section id="activities" className="group-tab">
            <div className="heading top-container">
                <div className="go-right">
                    { canI( "ACTIVITY", Permission.READ_WRITE, groupContext.group ) && <ActionButton
                        name="Criar"
                        buttonProps={{ onClick(){ setEditActivity( null ) } }}
                    /> }
                </div>
            </div>

            <div id="activities-list" className={`tab-list ${styles.list}`}>
                { activities.length === 0
                    ? <p className="empty-list">Nenhuma atividade encontrada</p>
                    : activities.map( a => <RenderActivity activity={ a } key={ a.id } /> )
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
    </GroupActivitiesContext.Provider>;
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

    return <div className={ styles.item }>
        <div className={ styles.info }>
            <div>
                <h3 className={ styles.title }>{ activity.name }</h3>
                <h4 className={ styles.location }>{ activity.location } ({ activity.workload }h)</h4>

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
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize( activity.description ) }}
        /> }

        { isChangingParticipants && <ChangeActivityParticipants
            activity={ activity }
            callback={ async form => {
                if ( form.confirmed ) {
                    await UniversimeApi.Activity.changeParticipants( activity.id, {
                        add: form.body.participants.added.map( p => p.id ),
                        remove: form.body.participants.removed.map( p => p.id ),
                    } );
                }

                setIsChangingParticipants( false );
            } }
        /> }
    </div>

    function toggleExpansion() { setIsExpanded( e => !e ); }
    function makeOptions(): OptionInMenu<Activity.DTO>[] {
        return [
            {
                text: "Editar",
                biIcon: "pencil-fill",
                hidden( activity ) {
                    return !canI( "ACTIVITY", Permission.READ_WRITE, activity.group );
                },
                onSelect( activity ) {
                    context?.setEditActivity( activity );
                },
            }, {
                text: "Alterar participantes",
                biIcon: "people-fill",
                hidden( activity ) {
                    return !canI( "ACTIVITY", Permission.READ_WRITE, activity.group );
                },
                onSelect(){
                    setIsChangingParticipants( true );
                }
            }, {
                text: "Deletar",
                biIcon: "trash-fill",
                className: styles.delete_option,
                hidden( activity ) {
                    return !canI( "ACTIVITY", Permission.READ_WRITE_DELETE, activity.group );
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

                    const res = await UniversimeApi.Activity.remove( activity.id );
                    if ( res.isSuccess() )
                        groupContext?.refreshData();
                },
            }
        ];
    }
}

function ChangeActivityParticipants( props: Readonly<ChangeActivityParticipantsProps> ) {
    const groupContext = useContext( GroupContext );
    const [ participants, setParticipants ] = useState<Profile.DTO[]>();
    useEffect( () => {
        UniversimeApi.Activity.listParticipants( props.activity.id )
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
            isSeparate
            isSearchable
            defaultValue={ participants }
            options={ groupContext!.participants }
        />
    </UniversiForm.Root>;
}

type RenderActivityProps = {
    activity: Activity.DTO;
};

type GroupActivitiesContextType = {
    editActivity: Possibly<Activity.DTO>;
    setEditActivity( action: React.SetStateAction<Possibly<Activity.DTO>> ): unknown;
};

type ChangeActivityParticipantsProps = {
    activity: Activity.DTO;
    callback( form: ChangeActivityParticipantsForm ): unknown;
};

type ChangeActivityParticipantsForm = UniversiForm.Data<{
    participants: SelectionChanges<Profile.DTO>;
}>;
