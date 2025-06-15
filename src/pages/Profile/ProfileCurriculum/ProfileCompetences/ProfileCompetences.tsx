import { useContext, useState } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";

import { UniversimeApi } from "@/services";
import BootstrapIcon from "@/components/BootstrapIcon";
import LoadingSpinner from "@/components/LoadingSpinner";
import { IconVerificated } from "@/components/UniversiSvg";
import { compareCompetences, CompetenceLevelObjects } from "@/types/Competence";
import * as SwalUtils from "@/utils/sweetalertUtils";

import { ProfileContext } from "../../ProfileContext";
import ProfileCurriculumTemplate from "../ProfileCurriculumTemplate";

import styles from "./ProfileCompetences.module.less";

export function ProfileCompetences() {
    const context = useContext( ProfileContext );
    const [ isDeleting, setIsDeleting ] = useState( false );

    if ( !context )
        return null;

    return <>
    <ProfileCurriculumTemplate
        data={ context.profileListData.competences }
        canEdit
        onClickEdit={ d => context.setEditCompetence( d ) }
        canDelete
        onClickDelete={ handleClickDelete }
        canCreate
        createLabel="Adicionar Competência"
        onClickCreate={ () => context.setEditCompetence( null ) }
        heading="Competências"
        getKey={ c => c.id }
        sort={ compareCompetences }
        emptyMessage={ `${ context.accessingLoggedUser ? "Você" : context.profile.firstname } não tem nenhuma competência cadastrada` }
        render={ ( { data } ) => <div className={ styles.item }>
            <div className={ styles.name }>
                { data.hasBadge &&
                    <IconVerificated className={ styles.badge } title={(context.profile.user.ownerOfSession ? "Você" : context.profile.firstname) + " possui um selo nesta competência"} />
                }
                <h4>{data.competenceType.name}</h4>
                { data.competenceType.reviewed ||
                    <BootstrapIcon icon="exclamation-diamond-fill" className={ styles.unreviewed } title="Esta competência não foi revisada por um administrador e não é visível publicamente" />
                }
                { data.activities.length > 0 && <Tooltip.Provider>
                    <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                            <BootstrapIcon icon="award-fill" className={ styles.activity_trigger }/>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                            <Tooltip.Content className={ styles.activity_tooltip }>
                                <span className={ styles.activity_header }>Atividades relacionadas</span>
                                <ul className={styles.activity_list}>
                                    { data.activities.map( a => <li key={ a.id } className={ styles.activity_name }>{ a.name }</li> ) }
                                </ul>
                            </Tooltip.Content>
                        </Tooltip.Portal>
                    </Tooltip.Root>
                </Tooltip.Provider> }
            </div>
            <div className={ styles.level }>
                <h2 className={ styles.level_label }>{CompetenceLevelObjects[data.level].label}</h2>
                <div className={ styles.level_bar_back }>
                    <div className={ styles.level_bar_front } style={{ width: `${ 25 * ( data.level + 1) }%` }}></div>
                </div>
            </div>
        </div> }
    />

    { isDeleting && <LoadingSpinner /> }
    </>;

    async function handleClickDelete( competence: Competence.DTO ) {
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

        const response = await UniversimeApi.Competence.remove( competence.id );
        if ( response.isSuccess() )
            await context?.reloadPage();

        setIsDeleting( false );
    }
}
