import { useContext } from "react";

import BootstrapIcon from "@/components/BootstrapIcon";

import { ActivitiesPageContext } from "./ActivitiesPageContext";

import styles from "./ActivitiesPage.module.less";


export function ActivityTypeItem( props: Readonly<ActivityTypeItemProps> ) {
    const { activityType } = props;
    const context = useContext( ActivitiesPageContext );

    if ( !context ) return null;

    return <div className={ styles.item }>
        <button title="Editar" onClick={ () => context.setEdit( activityType ) } className={ styles.edit_activity_button }>
            <BootstrapIcon icon="pencil-square" />
        </button>

        <p>{ activityType.name }</p>
    </div>;
}

export type ActivityTypeItemProps = {
    activityType: Activity.Type;
};
