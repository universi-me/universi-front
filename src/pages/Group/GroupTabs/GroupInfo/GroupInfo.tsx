import { useContext } from "react";

import { groupImageUrl } from "@/utils/apiUtils";

import { GroupContext } from "../../GroupContext";
import styles from "./GroupInfo.module.less";
import { formatActivityDate } from "../groupTabsUtils";
import RenderCompetenceType from "@/components/RenderCompetenceType";


export function GroupInfo() {
    const context = useContext( GroupContext )!;
    const { group } = context;
    const { activity } = group;

    return <section className={`group-tab ${ styles.tab }`}>
        <img className={ styles.image } src={ groupImageUrl( group ) } alt="" />
        { !group.bannerImage || <h3 className={ styles.title }>{ context.group.name }</h3> }

        { activity && <>
            <p>{ activity.type.name } ({ activity.workload }h)</p>
            <p>Local: { activity.location }</p>
            <p>Data: { formatActivityDate( activity.startDate, activity.endDate ) }</p>
            <p className={ styles.competences }>{ activity.badges.map( b => <RenderCompetenceType
                className={ styles.item }
                competenceType={ b }
                key={ b.id }
            /> ) }</p>
        </> }

        { context.group.description
            ? <div className={ styles.description } dangerouslySetInnerHTML={ { __html: context.group.description } } />
            : <p className={ `${ styles.description } ${ styles.empty }` }>Nenhuma descrição informada.</p>
        }
    </section>;
}
