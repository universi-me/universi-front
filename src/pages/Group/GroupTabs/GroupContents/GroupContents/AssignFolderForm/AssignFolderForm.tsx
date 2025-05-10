import { useContext, useEffect, useMemo, useState } from "react";

import AuthContext from "@/contexts/Auth";
import { UniversimeApi } from "@/services";
import LoadingSpinner from "@/components/LoadingSpinner";
import UniversiForm from "@/components/UniversiForm2";
import { UniversiFormCardSelectionInputValue } from "@/components/UniversiForm2/inputs/UniversiFormCardSelectionInput";
import ProfileImage from "@/components/ProfileImage";
import { GroupContext } from "@/pages/Group/GroupContext";

import { ProfileClass } from "@/types/Profile";

import styles from "./AssignFolderForm.module.less";


export function AssignFolderForm() {
    const groupContext = useContext( GroupContext )
    const authContext = useContext( AuthContext )

    const [ defaultValue, setDefaultValue ] = useState<ProfileClass[]>();
    useEffect( () => {
        if (!groupContext?.assignFolder) return;

        UniversimeApi.Capacity.Folder.assignments({
            folder: groupContext.assignFolder.id,
            assignedBy: authContext.profile!.id,
        }).then( res => {
            if ( !res.isSuccess() )
                groupContext.setAssignFolder( undefined );

            else
                setDefaultValue( res.body.map( a => ProfileClass.new( a.assignedTo ) ) );
        } );
    }, [] );

    const possibleAssignments = useMemo( () => {
        return [...groupContext?.participants ?? []]
            .filter(a => !a.user.needProfile && a.user.name !== authContext.profile?.user.name)
            .sort((a, b) => a.fullname!.localeCompare(b.fullname!));
    }, [groupContext?.participants, authContext.profile] );

    if ( defaultValue === undefined )
        return <LoadingSpinner />

    else
        return <UniversiForm.Root title="Atribuir Conteúdo" callback={ assignFolder }>
            <UniversiForm.Input.CardSelection
                param="people"
                label="Participantes do grupo"
                isSeparate
                getOptionUniqueValue={ p => p.id }
                defaultValue={ defaultValue }
                options={ possibleAssignments }
                render={ p => <div className={ styles.card } key={p.id}>
                    <ProfileImage className={ styles.picture } imageUrl={ p.imageUrl } name={ p?.fullname } />
                    <h2>{ p.fullname }</h2>
                </div> }
                validations={[
                    d => ( d.add.length > 0 ) || ( d.remove.length > 0 ),
                ]}
            />
        </UniversiForm.Root>

    async function assignFolder( form: AssignFolderForm ) {
        if ( groupContext?.assignFolder === undefined ) return;

        if ( !form.confirmed )
                groupContext.setAssignFolder(undefined);

        else {
            const res = await UniversimeApi.Capacity.Folder.changeAssignments( groupContext.assignFolder.id, {
                addProfileIds: form.body.people.add.map( p => p.id ),
                removeProfileIds: form.body.people.remove.map( p => p.id ),
            });

            if ( res.isSuccess() ) {
                groupContext.setAssignFolder(undefined);
                groupContext.refreshData();
            }
        }
    }
}

export type AssignFolderForm = UniversiForm.Data<{
    people: UniversiFormCardSelectionInputValue<ProfileClass, true>;
}>;
