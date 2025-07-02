import { useMemo, useState } from "react";
import { useLoaderData } from "react-router";

import useCache from "@/contexts/Cache";
import { UniversimeApi } from "@/services";
import Filter from "@/components/Filter";
import ActionButton from "@/components/ActionButton";
import ErrorPage from "@/components/ErrorPage";
import UniversiForm from "@/components/UniversiForm";
import { stringIncludesIgnoreCase } from "@/utils/stringUtils";

import { SettingsTitle, SettingsDescription, ActivityTypeItem } from "../..";
import { ActivitiesPageContext, type ActivitiesPageContextType } from "./ActivitiesPageContext";
import { ActivitiesPageLoaderFetch, type ActivitiesPageLoaderData } from "./ActivitiesPageLoader";

import styles from "./ActivitiesPage.module.less";


export function ActivitiesPage() {
    const loaderData = useLoaderData<ActivitiesPageLoaderData>();
    const cache = useCache();

    const [ errors, setErrors ] = useState( loaderData.success ? undefined : loaderData.reason );
    const [ filter, setFilter ] = useState( "" );
    const [ edit, setEdit ] = useState<Possibly<Activity.Type>>();

    const context = useMemo<ActivitiesPageContextType>( () => ({
        activityTypes: loaderData.success ? loaderData.types : [],
        setEdit,
        refreshContext,
    }), [] );

    if ( errors?.length ) return <ErrorPage
        title="Erro acessar a página"
        description={ <ul>{ errors.map( e => <li>{ e }</li> ) }</ul> }
    />

    const hasTypes = context.activityTypes.length > 0;
    const filteredTypes = context.activityTypes.filter( at => stringIncludesIgnoreCase( at.name, filter ) );

    return <ActivitiesPageContext.Provider value={ context }>
        <div>
            <SettingsTitle>Atividades</SettingsTitle>
            <SettingsDescription>Aqui você pode configurar os Tipos de Atividades disponíveis na plataforma.</SettingsDescription>

            <h2 className="section-title">Tipos de Atividades</h2>
            <div className={ styles.upper_actions }>
                <ActionButton name="Criar Tipo de Atividade" biIcon="plus-circle" buttonProps={{ onClick(){ context.setEdit( null ) } }} />
                <Filter placeholderMessage="Pesquisar Tipos de Atividades..." setter={ setFilter } />
            </div>
        </div>

        <section className={ styles.item_list }>
            {
                !hasTypes
                    ? <p className="error-warning">Nenhum Tipo de Atividade cadastrado.</p>
                    : filteredTypes.length == 0
                        ? <p className="error-warning">Nenhum Tipo de Atividade encontrado nessa pesquisa.</p>
                        : filteredTypes.map( at => <ActivityTypeItem key={ at.id } activityType={ at } /> )
            }
        </section>

        { edit !== undefined && <UniversiForm.Root
            title={ edit ? "Editar Tipo de Atividade" : "Criar Tipo de Atividade" }
            callback={ handleForm }
            allowDelete={ edit !== null }
            deleteAction={ () => UniversimeApi.ActivityType.remove( edit!.id ) }
        >
            <UniversiForm.Input.Text
                param="name"
                label="Nome"
                defaultValue={ edit?.name }
                required
            />
        </UniversiForm.Root> }
    </ActivitiesPageContext.Provider>;

    async function refreshContext() {
        const [ data ] = await Promise.all( [
            ActivitiesPageLoaderFetch(),
            cache.ActivityType.update(),
        ] );

        if ( data.success ) {
            context.activityTypes = data.types;
            context.setEdit( undefined );
            setErrors( undefined );
        } else {
            setErrors( data.reason );
        }
    }

    async function handleForm( form: ManageActivityTypeForm ) {
        if ( form.confirmed ) {
            const body = {
                name: form.body.name,
            };

            const res = edit
                ? await UniversimeApi.ActivityType.update( edit.id, body )
                : await UniversimeApi.ActivityType.create( body );
        }

        if ( form.action !== "CANCELED" )
            await refreshContext();

        setEdit( undefined );
    }
}

export type ManageActivityTypeForm = UniversiForm.Data<{
    name: string;
}>;
