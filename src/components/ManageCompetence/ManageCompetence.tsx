import { useEffect, useMemo, useState } from "react";

import { UniversimeApi } from "@/services";
import UniversiForm, { FormInputs } from "@/components/UniversiForm";
import { compareCompetenceTypes, LevelToDescription, LevelToLabel } from "@/types/Competence";
import * as SwalUtils from "@/utils/sweetalertUtils";

export function ManageCompetence( props: Readonly<ManageCompetenceProps> ) {
    const { competence, removeTypes, callback } = props;
    const isCreating = competence === null;

    const [competenceTypes, setCompetenceTypes] = useState<Optional<CompetenceType[]>>( undefined );
    useEffect( () => {
        updateCompetenceTypes();
    }, [] );

    const competenceTypeOptions = useMemo( () => {
        if ( competenceTypes === undefined ) return undefined;

        return competenceTypes
            .filter( c => !removeTypes?.some( r => c.id === r || r.toLocaleUpperCase() === c.name.toLocaleUpperCase() ) )
            .sort( compareCompetenceTypes )
            .map( makeTypeOption );
    }, [ competenceTypes ] )

    if ( competenceTypeOptions === undefined )
        return null;

    return <UniversiForm
        formTitle={ isCreating ? "Adicionar competência" : "Editar competência" }
        objects={[
            {
                DTOName: "competenceTypeId", label: "Tipo de Competência", type: FormInputs.SELECT_SINGLE,
                value: competence?.competenceType ? competence.competenceType.id : undefined,
                options: competenceTypeOptions,
                required: true,
                canCreate: true,
                async onCreate( name ) {
                    const createRes = await UniversimeApi.CompetenceType.create( { name } );
                    if ( createRes.isSuccess() ) {
                        const listRes = await updateCompetenceTypes();
                        return listRes?.map( makeTypeOption );
                    }
                }
            },
            {
                DTOName: "level", label: "Nível de Experiência", type: FormInputs.RADIO,
                value: competence?.level,
                options: LEVEL_OPTIONS, required: true
            },
            {
                DTOName: "description", label: "description", type: FormInputs.HIDDEN,
                value: competence?.description ?? ""
            },
            {
                DTOName: "competenceId", label: "competenceId", type: FormInputs.HIDDEN,
                value: competence?.id
            }
        ]}
        requisition={ requisition}
        callback={ callback }
    />

    async function updateCompetenceTypes() {
        const res = await UniversimeApi.CompetenceType.list();

        if ( res.isSuccess() ) {
            const list = res.body.slice().sort( compareCompetenceTypes );
            setCompetenceTypes( list );
            return list;
        }

        else {
            await SwalUtils.fireModal({
                title: "Ocorreu um erro",
                text: res.errorMessage ?? "Erro ao buscar tipos de competência disponíveis",

                confirmButtonText: "Fechar",
                confirmButtonColor: "var(--wrong-invalid-color)",
            });
            callback?.();
        }
    }

    function requisition( form: CompetenceForm ) {
        const body = {
            competenceTypeId: form.competenceTypeId,
            description: form.description,
            level: form.level,
        };

        if ( form.competenceId )
            return UniversimeApi.Competence.update( form.competenceId, body );

        else
            return UniversimeApi.Competence.create( body )
    }
}

const LEVEL_OPTIONS = Object.entries( LevelToLabel ).map(([ lvStr ]) => {
    const level = parseInt( lvStr ) as Competence.Level;
    return {
        value: level,
        label: `${ LevelToLabel[ level ] }: ${ LevelToDescription[ level ] }`,
    };
});

function makeTypeOption( ct: Competence.Type ) {
    return {
        value: ct.id,
        label: ct.name,
    }
}

export type ManageCompetenceProps = {
    competence: Competence | null;
    removeTypes?: string[];
    callback?: () => any;
};

type CompetenceForm = {
    competenceId: Optional<string>;
    competenceTypeId: string;
    description: string;
    level: CompetenceLevel;
};
