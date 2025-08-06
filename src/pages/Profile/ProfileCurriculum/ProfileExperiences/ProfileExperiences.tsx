import { useContext, useState } from "react";

import { UniversimeApi } from "@/services";
import LoadingSpinner from "@/components/LoadingSpinner";
import * as SwalUtils from "@/utils/sweetalertUtils";
import { dateWithoutTimezone } from "@/utils/dateUtils";
import { ICON_EXPERIENCE } from "@/utils/assets";
import { compareExperiences } from "@/types/Experience";

import ProfileCurriculumTemplate from "../ProfileCurriculumTemplate";
import { ProfileContext } from "../../ProfileContext";

import styles from "./ProfileExperiences.module.less";


export function ProfileExperiences() {
    const context = useContext( ProfileContext );
    const [ isDeleting, setIsDeleting ] = useState( false );

    if ( !context )
        return null;

    return <>
        <ProfileCurriculumTemplate
            data={ context.profileListData.experience }
            heading="Experiências"
            canCreate
            onClickCreate={ () => context.setEditExperience( null ) }
            createLabel="Adicionar Experiência"
            canEdit
            onClickEdit={ e => context.setEditExperience( e ) }
            canDelete
            onClickDelete={ handleClickDelete }
            emptyMessage={ `${ context.accessingLoggedUser ? "Você" : context.profile.firstname } não tem nenhuma experiência cadastrada` }
            getKey={ e => e.id }
            sort={ compareExperiences }
            render={ ( { data } ) => <div className={ styles.item }>
                <div className={ styles.info }>
                    <div className={ styles.presentation }>
                        <div className={ styles.title }>
                            <img className={ styles.icon } src={ ICON_EXPERIENCE } />
                            <h4 className={ styles.type }>{ data.experienceType.name }</h4>
                        </div>
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
                </div>

                <div className={ styles.description_wrapper }>
                    <h4 className={ styles.title }>Descrição</h4>
                    <h4 className={ styles.description }>{ data.description }</h4>
                </div>
            </div> }
        />

        { isDeleting && <LoadingSpinner /> }
    </>;

    async function handleClickDelete( experience: Experience.DTO ) {
        const res = await SwalUtils.fireModal({
            icon: "warning",
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonColor: "var(--font-color-alert)",

            title : "Excluir experiência?",
            text: "Tem certeza? Esta ação é irreversível", 
            confirmButtonText: "Sim",
            cancelButtonText: "Não"
        });
        if ( !res.isConfirmed ) return;

        setIsDeleting( true );

        const response = await UniversimeApi.Experience.remove( experience.id );
        if ( response.isSuccess() )
            await context?.reloadPage();

        setIsDeleting( false );
    }

    function formatDate( dateString: string ) {
        return dateWithoutTimezone( dateString )
            .toLocaleDateString( "pt-BR" );
    }
}