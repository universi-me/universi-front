import { useContext, useState } from "react";

import { UniversimeApi } from "@/services";
import LoadingSpinner from "@/components/LoadingSpinner";
import { dateWithoutTimezone } from "@/utils/dateUtils";
import * as SwalUtils from "@/utils/sweetalertUtils";
import { compareEducations } from "@/types/Education";

import ProfileCurriculumTemplate from "../ProfileCurriculumTemplate";
import { ProfileContext } from "../../ProfileContext";

import styles from "./ProfileEducations.module.less";


export function ProfileEducations() {
    const context = useContext( ProfileContext );
    const [ isDeleting, setIsDeleting ] = useState( false );

    if ( !context )
        return null;

    return <>
    <ProfileCurriculumTemplate
        data={ context.profileListData.education }
        heading="Formações Acadêmicas"
        canCreate
        onClickCreate={ () => context.setEditEducation( null ) }
        createLabel="Adicionar Formação"
        canEdit
        onClickEdit={ e => context.setEditEducation( e ) }
        canDelete
        onClickDelete={ handleClickDelete }
        getKey={ e => e.id }
        sort={ compareEducations }
        emptyMessage={ `${ context.accessingLoggedUser ? "Você" : context.profile.firstname } não tem nenhuma formação cadastrada` }
        render={ ( { data } ) => <div className={ styles.item }>
            <div className={ styles.presentation }>
                <h4 className={ styles.type }>{ data.educationType.name }</h4>
                <h4 className={ styles.institution }>{ data.institution.name }</h4>
            </div>

            <div className={ styles.date_wrapper }>
                <h4 className={ styles.date_title }>Data de Início</h4>
                <h4 className={ styles.date }>{ formatDate( data.startDate ) }</h4>
            </div>

            <div className={ styles.date_wrapper }>
                <h4 className={ styles.date_title }>Data de Término</h4>
                <h4 className={ styles.date }>
                    { data.endDate === null ? 'Atuando' : formatDate( data.endDate ) }
                </h4>
            </div>
        </div> }
    />

    { isDeleting && <LoadingSpinner /> }
    </>;

    async function handleClickDelete( education: Education.DTO ) {
        const res = await SwalUtils.fireModal({
            icon: "warning",
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonColor: "var(--font-color-alert)",

            title : "Excluir competência?",
            text: "Tem certeza? Esta ação é irreversível", 
            confirmButtonText: "Sim",
            cancelButtonText: "Não"
        });
        if ( !res.isConfirmed ) return;

        setIsDeleting( true );

        const response = await UniversimeApi.Education.remove( education.id );
        if ( response.isSuccess() )
            await context?.reloadPage();

        setIsDeleting( false );
    }

    function formatDate( dateString: string ) {
        return dateWithoutTimezone( dateString )
            .toLocaleDateString( "pt-BR" );
    }
}
