import { useContext, useEffect, useMemo, useState } from "react";

import AuthContext from "@/contexts/Auth";
import { UniversimeApi } from "@/services";
import LoadingSpinner from "@/components/LoadingSpinner";
import UniversiForm from "@/components/UniversiForm";
import { GroupContext } from "@/pages/Group/GroupContext";

import { ProfileClass, ProfileSelect } from "@/types/Profile";
import { ArrayChanges } from "@/utils/arrayUtils";


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
            <ProfileSelect
                param="people"
                label="Participantes do grupo"
                isSearchable
                defaultValue={ defaultValue }
                options={ possibleAssignments }
                validations={[
                    value => ArrayChanges.from( defaultValue, value, ( p1, p2 ) => p1.id === p2.id ).hasChanges,
                ]}
            />
        </UniversiForm.Root>

    async function assignFolder( form: AssignFolderForm ) {
        if ( groupContext?.assignFolder === undefined ) return;

        if ( !form.confirmed )
                groupContext.setAssignFolder(undefined);

        else {
            const changes = ArrayChanges.from( defaultValue, form.body.people, ( p1, p2 ) => p1.id === p2.id );

            const res = await UniversimeApi.Capacity.Folder.changeAssignments( groupContext.assignFolder.id, {
                addProfileIds: changes.added.map( p => p.id ),
                removeProfileIds: changes.removed.map( p => p.id ),
            });

            if ( res.isSuccess() ) {
                groupContext.setAssignFolder(undefined);
                groupContext.refreshData();
            }
        }
    }
}

export type AssignFolderForm = UniversiForm.Data<{
    people: ProfileClass[];
}>;
