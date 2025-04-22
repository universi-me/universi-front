import { SettingsDescription, SettingsTitle } from "@/pages/Settings";
import { useLoaderData } from "react-router";

import { type DepartmentLoaderData } from "./DepartmentPageLoader";
import { DepartmentItem } from "./components";
import { Filter } from "@/components/Filter/Filter";
import { useEffect, useState } from "react";
import { DepartmentPageContext } from "./DepartmentPageContext";
import { UniversimeApi } from "@/services";


export function DepartmentPage() {
    const loaderData = useLoaderData() as DepartmentLoaderData;

    const [ departments, setDepartments ] = useState( loaderData.departments );
    const [ textFilter, setTextFilter ] = useState<string>( "" );

    useEffect( () => {
        setDepartments( loaderData.departments );
    }, [ loaderData ]);

    return <DepartmentPageContext.Provider value={{ departments, refreshDepartments }}>
        <div id="departments-settings-page">
            <SettingsTitle>Departamentos</SettingsTitle>
            <SettingsDescription>Aqui você pode configurar os departamentos disponíveis na plataforma.</SettingsDescription>

            <section id="departments-listing">
                <div className="filter-wrapper">
                    <h2 className="section-title">Departamentos</h2>
                    <Filter placeholderMessage="Pesquisar Departamento..." setter={ setTextFilter } />
                </div>

                <div className="departaments-wrapper">
                    { departments === null
                        ? <p className="error-warning">Falha ao buscar departamentos disponíveis.</p>
                    : departments.length == 0
                        ? <p className="error-warning">Nenhum departamento cadastrado.</p>
                    : departments.map( d => <DepartmentItem department={ d } key={ d.id } /> )
                    }
                </div>
            </section>
        </div>
    </DepartmentPageContext.Provider>

    async function refreshDepartments() {
        const res = await UniversimeApi.Department.list();
        setDepartments( res.body ?? null );
    }
}
