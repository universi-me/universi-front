import { useContext, useMemo } from "react"
import { Link } from "react-router";

import { groupImageUrl } from "@/utils/apiUtils";
import { compareActivities } from "@/types/Activity";

import { ProfileContext } from "../../../ProfileContext";
import styles from "./CurriculumActivities.module.less";


export function CurriculumActivities() {
    const profileContext = useContext( ProfileContext );

    const activities = useMemo( () => {
        return profileContext
            ?.profileListData
            .activities
            ?.sort( compareActivities )
            ?? [];
    }, [ profileContext?.profileListData.activities ] );

    if ( !profileContext ) return null;

    return <div className="competence">
        <div className="heading">
            <div className="competence-left-buttons">
                <div className="competence-title">
                    Atividades
                </div>
            </div>
        </div>
        <div className="competence-list">
            { activities.length > 0
                ? activities.map( activity => <div className="competence-item" key={ activity.id }>
                    <div className="competence-initial">
                        <h4 className="competence-type">{ activity.name }</h4>
                    </div>

                    <div className="level-container">
                        <Link to={`/group${activity.group.path}`} className={ styles.group_link }>
                            <img src={ groupImageUrl( activity.group ) } className={ styles.image } alt={ activity.group.name }/>
                            { activity.group.name }
                        </Link>
                    </div>
                </div> )
                : <p className="empty-competences">Nenhuma competência cadastrada.</p>
            }
        </div>
    </div>
}
