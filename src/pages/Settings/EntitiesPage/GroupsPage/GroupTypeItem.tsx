import { useContext } from "react";

import BootstrapIcon from "@/components/BootstrapIcon";

import { GroupsPageContext } from "./GroupsPageContext";

import styles from "./GroupsPage.module.less";


export function GroupTypeItem( props: Readonly<GroupTypeItemProps> ) {
    const { groupType } = props;
    const context = useContext( GroupsPageContext );

    if ( !context ) return null;

    return <div className={ styles.item }>
        <button title="Editar" onClick={ () => context.setEdit( groupType ) } className={ styles.edit_group_type_button }>
            <BootstrapIcon icon="pencil-square" />
        </button>

        <p>{ groupType.label }</p>
    </div>;
}

export type GroupTypeItemProps = {
    groupType: Group.Type;
};
