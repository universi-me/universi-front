import { useContext, useEffect, useState } from "react";

import AuthContext from "@/contexts/Auth";
import LoadingSpinner from "@/components/LoadingSpinner";
import UniversiForm from "@/components/UniversiForm";
import { UniversimeApi } from "@/services";
import { ArrayChanges } from "@/utils/arrayUtils";
import { ProfileSelect } from "@/types/Profile";

export function ChangeGroupParticipantsForm( props: Readonly<GroupPeople.ChangeGroupParticipants.Props> ) {
    const { group, options: optionsParam, callback } = props;

    const auth = useContext( AuthContext );
    const [ participants, setParticipants ] = useState<Profile.DTO[]>();
    const [ options, setOptions ] = useState<Profile.DTO[]>();

    useEffect( () => {
        loadParticipants();
        loadOptions();
    }, [] );

    if ( participants === undefined || options === undefined )
        return <LoadingSpinner />;

    return <UniversiForm.Root callback={ handleForm } title={ "Alterar participantes" }>
        <ProfileSelect
            param="participants"
            label="Usuário"
            required
            options={ options }
            defaultValue={ participants }
            validations={ [
                value => ArrayChanges.from( participants, value, ( p1, p2 ) => p1.id === p2.id ).hasChanges
            ] }
        />
    </UniversiForm.Root>;

    async function loadParticipants() {
        const res = await UniversimeApi.GroupParticipant.get( group.id! );

        if ( res.isSuccess() )
            setParticipants( res.body );
        else
            return callback?.( false );
    }

    async function handleForm( form: GroupPeople.ChangeGroupParticipants.Form ) {
        if ( form.confirmed ) {
            const changes = ArrayChanges.from( participants, form.body.participants, ( p1, p2 ) => p1.id === p2.id );

            const res = await UniversimeApi.GroupParticipant.changeParticipants( group.id!, {
                add: changes.added.map( p => ({ profile: p.id }) ),
                remove: changes.removed.map( p => p.id ),
            } );

            return callback?.( true );
        }

        return callback?.( false );
    }

    async function loadOptions() {
        if ( optionsParam !== undefined ) {
            setOptions( optionsParam );
            return;
        }

        const res = await UniversimeApi.GroupParticipant.get( auth.organization.id! );
        if ( res.isSuccess() )
            setOptions( res.body );
        else
            return callback?.( false );
    }
}
