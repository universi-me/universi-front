import { SettingsDescription, SettingsTitle } from "@/pages/Settings";
import { useLoaderData } from "react-router";

import { type DepartmentLoaderData } from "./DepartmentPageLoader";
import { DepartmentItem } from "./components";
import { Filter } from "@/components/Filter/Filter";
import { useEffect, useMemo, useState } from "react";
import { DepartmentPageContext } from "./DepartmentPageContext";
import { UniversimeApi } from "@/services";
import ActionButton from "@/components/ActionButton";
import UniversiForm from "@/components/UniversiForm2";
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
            <SettingsTitle>Órgãos/Áreas</SettingsTitle>
            <SettingsDescription>Aqui você pode configurar os órgãos/áreas disponíveis na plataforma.</SettingsDescription>

            <h2 className="section-title">Órgãos/Áreas</h2>
            <Filter placeholderMessage="Pesquisar Órgão/Área..." setter={ setTextFilter } />

            <section id="departments-listing">
                { departments === null
                    ? <p className="error-warning">Falha ao buscar órgão/área disponíveis.</p>
                : departments.length == 0
                    ? <p className="error-warning">Nenhum órgão/área cadastrado.</p>
                : filteredDepartments.length === 0
                    ? <p className="error-warning">Nenhum órgão/área encontrado</p>
                : filteredDepartments.map( d => <DepartmentItem department={ d } key={ d.id } /> )
                }
            </section>
            { departments !== null && !creatingDepartment && <ActionButton name="Criar órgão/área" buttonProps={{ onClick: () => setCreatingDepartment( true ) }} /> }

            { creatingDepartment && <UniversiForm.Root title="Criar órgão/área" confirmButtonText="Criar" callback={ createDepartment }>
                <UniversiForm.Input.Text
                    param="acronym"
                    label="Sigla"
                    required
                />

                <UniversiForm.Input.Text
                    param="name"
                    label="Nome"
                    required
                />
            </UniversiForm.Root>
            }
        </div>
    </DepartmentPageContext.Provider>

    async function refreshDepartments() {
        const res = await UniversimeApi.Department.list();
        setDepartments( res.body ?? null );
    }

    async function createDepartment( form: CreateDepartmentForm ) {
        if ( !form.confirmed ) {
            setCreatingDepartment( false );
            return;
        }

        const res = await UniversimeApi.Department.create( form.body );
        await refreshDepartments();
        setCreatingDepartment( false );
    }
}

type CreateDepartmentForm = UniversiForm.Data<{
    acronym: string;
    name: string;
}>;
