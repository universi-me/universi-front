import { useContext } from "react";
import { Link } from "react-router";

import { groupImageUrl } from "@/utils/apiUtils";
import { compareActivities } from "@/types/Activity";

import ProfileCurriculumTemplate from "../ProfileCurriculumTemplate";
import { ProfileContext } from "../../ProfileContext";

import styles from "./ProfileActivities.module.less";


export function ProfileActivities() {
    const context = useContext( ProfileContext );
    if ( !context )
        return null;

    return <ProfileCurriculumTemplate
        data={ context.profileListData.activities }
        canEdit={ false }
        canCreate={ false }
        canDelete={ false }
        heading="Atividades"
        getKey={ a => a.id }
        sort={ compareActivities }
        emptyMessage={`${ context.accessingLoggedUser ? "Você" : context.profile.firstname } não participa de nenhuma atividade`}
        render={ ({ data }) => <div className={ styles.item }>
            <h4>{ data.name }</h4>
            <Link to={`/group${data.group.path}`} className={ styles.group_link }>
                <img src={ groupImageUrl( data.group ) } alt={ data.group.name } className={ styles.image }/>
                { data.group.name }
            </Link>
        </div> }
    />
}
