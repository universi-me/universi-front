import { useContext, useMemo, useState } from "react";

import BootstrapIcon from "@/components/BootstrapIcon";
import { makeClassName } from "@/utils/tsxUtils";

import { ProfileContext } from "../../ProfileContext";
import styles from "./ProfileCurriculumTemplate.module.less";

export function ProfileCurriculumTemplate<T>( props: Readonly<ProfileCurriculumTemplateProps<T>> ) {
    const { heading, data, canEdit, canDelete, canCreate, emptyMessage, render: RenderData } = props;

    const context = useContext( ProfileContext );
    const [ isEditing, setIsEditing ] = useState( false );

    const renders = useMemo( () => {
        const getCanEdit = typeof canEdit === "boolean" || typeof canEdit === "undefined"
            ? ( _: T ) => canEdit ?? false
            : canEdit;

        const getCanDelete = typeof canDelete === "boolean" || typeof canDelete === "undefined"
            ? ( _: T ) => canDelete ?? false
            : canDelete;

        return data
            ?.toSorted( props.sort )
            .map<Omit<ProfileCurriculumTemplateRenderProps<T>, "isEditing">>( value => ({
                value,
                canEdit: getCanEdit( value ),
                canDelete: getCanDelete( value ),
            }) );
    }, [ data, canEdit, canDelete ] );

    if ( !context || renders === undefined )
        return null;

    const renderEditButton = context.accessingLoggedUser
        && renders.some( r => r.canEdit || r.canDelete );

    return <div className={ styles.card }>
        <div className={ styles.heading }>
            <div className={ styles.card_title }>
                { heading }

                { renderEditButton && <button onClick={ toggleEditing } className={ makeClassName( styles.edit_button, isEditing && styles.active ) }>
                    <BootstrapIcon icon="pencil-fill" />
                </button> }
            </div>

            { context.accessingLoggedUser && canCreate && <button className={ styles.add_button } onClick={ props.onClickCreate }>
                { props.createLabel } <BootstrapIcon icon="plus-circle-fill" className={ styles.add_icon } />
            </button> }
        </div>

        <div className={ styles.list }>
            { renders.length === 0 && <p className={ styles.empty_list }>{ emptyMessage }</p> }
            { renders.length > 0 && renders.map( d => <div key={ props.getKey( d.value ) } className={ styles.item }>
                <RenderData data={ d.value } />
                { isEditing && ( d.canEdit || d.canDelete ) && <div className={ styles.edit_buttons }>
                    { d.canDelete && props.canDelete && props.onClickDelete && <button
                        className={ styles.delete_item_button }
                        onClick={ () => props.onClickDelete( d.value ) }
                        title="Apagar"
                    >
                        <BootstrapIcon icon="trash-fill" />
                    </button> }

                    { d.canEdit && props.canEdit && props.onClickEdit && <button
                        className={ styles.edit_item_button }
                        onClick={ () => props.onClickEdit( d.value ) }
                        title="Editar"
                    >
                        <BootstrapIcon icon="pencil-fill" />
                    </button> }
                </div> }
            </div> ) }
        </div>
    </div>

    function toggleEditing() {
        setIsEditing( e => !e );
    }
}

export type ProfileCurriculumTemplateProps<T> = {
    data: Possibly<T[]>;

    heading: NonNullable<React.ReactNode>;
    emptyMessage: NonNullable<React.ReactNode>;

    render( props: { data: T } ): NonNullable<React.ReactElement>;
    sort?( value1: T, value2: T ): number;

    getKey( data: T ): React.Key;
} & ({
    canCreate: true;
    createLabel: string;
    onClickCreate(): unknown;
} | {
    canCreate?: false;
}) & ({
    canEdit: true | Predicate<T>;
    onClickEdit( data: T ): unknown;
} | {
    canEdit?: false;
}) & ({
    canDelete: true | Predicate<T>;
    onClickDelete( data: T ): unknown;
} | {
    canDelete?: false;
});

export type ProfileCurriculumTemplateRenderProps<T> = {
    value: T;
    isEditing: boolean;
    canEdit: boolean;
    canDelete: boolean;
};
