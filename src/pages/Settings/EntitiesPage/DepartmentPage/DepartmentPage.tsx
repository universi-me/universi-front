import { SettingsDescription, SettingsTitle } from "@/pages/Settings";
import { useLoaderData } from "react-router";

import { type DepartmentLoaderData } from "./DepartmentPageLoader";
import { DepartmentItem } from "./components";
import { Filter } from "@/components/Filter/Filter";
import { useEffect, useMemo, useState } from "react";
import { DepartmentPageContext } from "./DepartmentPageContext";
import { UniversimeApi } from "@/services";
import ActionButton from "@/components/ActionButton";
import UniversiForm, { FormInputs } from "@/components/UniversiForm";
import stringUtils from "@/utils/stringUtils";

import "./DepartmentPage.less";

export function DepartmentPage() {
    const loaderData = useLoaderData() as DepartmentLoaderData;

    const [ departments, setDepartments ] = useState( loaderData.departments );
    const [ textFilter, setTextFilter ] = useState<string>( "" );

    const [ creatingDepartment, setCreatingDepartment ] = useState( false );
    const filteredDepartments = useMemo( () => {
        return departments === null
            ? []
            : departments.filter( d => stringUtils.includesIgnoreCase( d.acronym, textFilter ) || stringUtils.includesIgnoreCase( d.name, textFilter ) );
    }, [ textFilter, departments ] );

    useEffect( () => {
        setDepartments( loaderData.departments );
    }, [ loaderData ]);

    return <DepartmentPageContext.Provider value={{ departments, refreshDepartments }}>
        <div id="departments-settings-page">
            <SettingsTitle>Departamentos</SettingsTitle>
            <SettingsDescription>Aqui você pode configurar os departamentos disponíveis na plataforma.</SettingsDescription>

            <h2 className="section-title">Departamentos</h2>
            <Filter placeholderMessage="Pesquisar Departamento..." setter={ setTextFilter } />

            <section id="departments-listing">
                { departments === null
                    ? <p className="error-warning">Falha ao buscar departamentos disponíveis.</p>
                : departments.length == 0
                    ? <p className="error-warning">Nenhum departamento cadastrado.</p>
                : filteredDepartments.length === 0
                    ? <p className="error-warning">Nenhum departamento encontrado</p>
                : filteredDepartments.map( d => <DepartmentItem department={ d } key={ d.id } /> )
                }
            </section>
            { departments !== null && !creatingDepartment && <ActionButton name="Criar departamento" buttonProps={{ onClick: () => setCreatingDepartment( true ) }} /> }

            { creatingDepartment && <UniversiForm
                formTitle="Criar departamento" saveButtonText="Criar"
                objects={[
                    { DTOName: "acronym", label: "Sigla", type: FormInputs.TEXT, required: true },
                    { DTOName: "name", label: "Nome", type: FormInputs.TEXT, required: true },
                ]}
                requisition={ ( form: CreateDepartmentForm ) => UniversimeApi.Department.create( form ) }
                callback={ async () => {
                    await refreshDepartments();
                    setCreatingDepartment( false );
                } }
            /> }
        </div>
    </DepartmentPageContext.Provider>

    async function refreshDepartments() {
        const res = await UniversimeApi.Department.list();
        setDepartments( res.body ?? null );
    }
}

type CreateDepartmentForm = {
    acronym: string;
    name: string;
};
