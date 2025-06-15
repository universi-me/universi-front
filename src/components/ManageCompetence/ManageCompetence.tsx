import { useEffect, useMemo, useState } from "react";

import { UniversimeApi } from "@/services";
import UniversiForm from "@/components/UniversiForm";
import LoadingSpinner from "@/components/LoadingSpinner";
import { compareCompetenceTypes, CompetenceLevelArrayObject, CompetenceLevelSelect, CompetenceTypeSelect, getCompetenceLevelObject } from "@/types/Competence";
import { ApiResponse } from "@/utils/apiUtils";
import * as SwalUtils from "@/utils/sweetalertUtils";

import styles from "./ManageCompetence.module.less";

export function ManageCompetence( props: Readonly<ManageCompetenceProps> ) {
    const { competence, removeTypes, callback } = props;
    const isCreating = competence === null;

    const [competenceTypes, setCompetenceTypes] = useState<Optional<CompetenceType[]>>( undefined );
    useEffect( () => {
        updateCompetenceTypes();
    }, [] );

    const [ level, setLevel ] = useState( getCompetenceLevelObject( competence?.level ) );

    const competenceTypeOptions = useMemo( () => {
        return competenceTypes
            ?.filter( c => !removeTypes?.some( r => c.id === r || r.toLocaleUpperCase() === c.name.toLocaleUpperCase() ) )
            .sort( compareCompetenceTypes );
    }, [ competenceTypes ] )

    if ( competenceTypeOptions === undefined )
        return <LoadingSpinner />;

    const formTitle = isCreating ? "Adicionar Competência" : "Editar Competência";

    return <UniversiForm.Root title={ formTitle } callback={ handleForm }>
        <CompetenceTypeSelect
            param="competenceType"
            label="Tipo da Competência"
            required
            isSearchable
            defaultValue={ competence?.competenceType }
            options={ competenceTypeOptions }
            onUpdateOptions={ setCompetenceTypes }
        />

        <div>
            <CompetenceLevelSelect
                param="level"
                label="Nível de Experiência"
                required
                defaultValue={ competence?.level }
                onChange={ setLevel }
            />
            <p className={ styles.level_description }>
                { level !== undefined ? level.description : "Selecione um nível de experiência" }
            </p>
        </div>
    </UniversiForm.Root>

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
            callback?.( undefined );
        }
    }

    async function handleForm( form: CompetenceForm ) {
        if ( !form.confirmed )
            return callback?.( undefined );

        const body = {
            competenceTypeId: form.body.competenceType.id,
            level: form.body.level.level,
        };

        const res = competence
            ? await UniversimeApi.Competence.update( competence.id, body )
            : await UniversimeApi.Competence.create( body );

        return callback?.( res );
    }
}

export type ManageCompetenceProps = {
    competence: Competence | null;
    removeTypes?: string[];
    callback?: ( response: Optional<ApiResponse<Competence.DTO>> ) => any;
};

type CompetenceForm = UniversiForm.Data<{
    competenceType: Competence.Type;
    level: CompetenceLevelArrayObject;
}>;
