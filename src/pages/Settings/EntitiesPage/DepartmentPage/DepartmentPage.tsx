import { SettingsDescription, SettingsTitle } from "@/pages/Settings";
import { useLoaderData } from "react-router";

import { type DepartmentLoaderData } from "./DepartmentPageLoader";
import { DepartmentItem } from "./components";
import { Filter } from "@/components/Filter/Filter";
import { useEffect, useMemo, useState } from "react";
import { DepartmentPageContext } from "./DepartmentPageContext";
import { UniversimeApi } from "@/services";
import ActionButton from "@/components/ActionButton";
import UniversiForm from "@/components/UniversiForm";
import stringUtils from "@/utils/stringUtils";

import "./DepartmentPage.less";

export function DepartmentPage() {
    const loaderData = useLoaderData() as DepartmentLoaderData;

    const [ departments, setDepartments ] = useState( loaderData.departments );
    const [ textFilter, setTextFilter ] = useState<string>( "" );

    const [ editDepartment, setEditDepartment ] = useState<Possibly<Department.DTO>>();
    const filteredDepartments = useMemo( () => {
        return departments === null
            ? []
            : departments.filter( d => stringUtils.includesIgnoreCase( d.acronym, textFilter ) || stringUtils.includesIgnoreCase( d.name, textFilter ) );
    }, [ textFilter, departments ] );

    useEffect( () => {
        setDepartments( loaderData.departments );
    }, [ loaderData ]);

    return <DepartmentPageContext.Provider value={{ departments, setEditDepartment, refreshDepartments }}>
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
            { departments !== null && <ActionButton name="Criar órgão/área" buttonProps={{ onClick: () => setEditDepartment( null ) }} /> }

            { editDepartment !== undefined && <UniversiForm.Root
                title={ editDepartment ? "Editar Órgão/Área" : "Criar Órgão/Área" }
                callback={ handleForm }
            >
                <UniversiForm.Input.Text
                    param="acronym"
                    label="Sigla"
                    defaultValue={ editDepartment?.acronym }
                    required
                />

                <UniversiForm.Input.Text
                    param="name"
                    label="Nome"
                    defaultValue={ editDepartment?.name }
                    required
                />
            </UniversiForm.Root> }
        </div>
    </DepartmentPageContext.Provider>

    async function refreshDepartments() {
        const res = await UniversimeApi.Department.list();
        setDepartments( res.body ?? null );
    }

    async function handleForm( form: CreateDepartmentForm ) {
        if ( !form.confirmed ) {
            setEditDepartment( undefined );
            return;
        }

        const res = editDepartment
            ? await UniversimeApi.Department.update( editDepartment.id, form.body )
            : await UniversimeApi.Department.create( form.body );

        await refreshDepartments();
        setEditDepartment( undefined );
    }
}

type CreateDepartmentForm = UniversiForm.Data<{
    acronym: string;
    name: string;
}>;
