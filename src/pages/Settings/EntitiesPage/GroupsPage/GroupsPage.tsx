import { useMemo, useState } from "react";
import { useLoaderData } from "react-router";

import useCache from "@/contexts/Cache";
import { UniversimeApi } from "@/services";
import Filter from "@/components/Filter";
import ActionButton from "@/components/ActionButton";
import ErrorPage from "@/components/ErrorPage";
import UniversiForm from "@/components/UniversiForm";
import { stringIncludesIgnoreCase } from "@/utils/stringUtils";

import { SettingsTitle, SettingsDescription } from "../..";
import { GroupsPageContext, type GroupsPageContextType } from "./GroupsPageContext";
import { GroupsPageLoaderFetch, type GroupsPageLoaderData } from "./GroupsPageLoader";

import styles from "./GroupsPage.module.less";
import { GroupTypeItem } from "./GroupTypeItem";


export function GroupsPage() {
    const loaderData = useLoaderData<GroupsPageLoaderData>();
    const cache = useCache();

    const [ errors, setErrors ] = useState( loaderData.success ? undefined : loaderData.reason );
    const [ filter, setFilter ] = useState( "" );
    const [ edit, setEdit ] = useState<Possibly<Group.Type>>();

    const context = useMemo<GroupsPageContextType>( () => ({
        groupTypes: loaderData.success ? loaderData.types : [],
        setEdit,
        refreshContext,
    }), [] );

    if ( errors?.length ) return <ErrorPage
        title="Erro acessar a página"
        description={ <ul>{ errors.map( e => <li>{ e }</li> ) }</ul> }
    />

    const hasTypes = context.groupTypes.length > 0;
    const filteredTypes = context.groupTypes.filter( at => stringIncludesIgnoreCase( at.label, filter ) );

    return <GroupsPageContext.Provider value={ context }>
        <div>
            <SettingsTitle>Grupos</SettingsTitle>
            <SettingsDescription>Aqui você pode configurar os Tipos de Grupos disponíveis na plataforma.</SettingsDescription>

            <h2 className="section-title">Tipos de Grupos</h2>
            <div className={ styles.upper_actions }>
                <ActionButton name="Criar Tipo de Grupo" biIcon="plus-circle" buttonProps={{ onClick(){ context.setEdit( null ) } }} />
                <Filter placeholderMessage="Pesquisar Tipos de Grupos..." setter={ setFilter } />
            </div>
        </div>

        <section className={ styles.item_list }>
            {
                !hasTypes
                    ? <p className="error-warning">Nenhum Tipo de Grupo cadastrado.</p>
                    : filteredTypes.length == 0
                        ? <p className="error-warning">Nenhum Tipo de Grupo encontrado nessa pesquisa.</p>
                        : filteredTypes.map( at => <GroupTypeItem key={ at.id } groupType={ at } /> )
            }
        </section>

        { edit !== undefined && <UniversiForm.Root
            title={ edit ? "Editar Tipo de Grupo" : "Criar Tipo de Grupo" }
            callback={ handleForm }
            allowDelete={ edit !== null }
            deleteAction={ async () => {
                await UniversimeApi.GroupType.remove( edit!.id );
                await cache.GroupType.update();
            } }
        >
            <UniversiForm.Input.Text
                param="label"
                label="Nome"
                defaultValue={ edit?.label }
                required
            />
        </UniversiForm.Root> }
    </GroupsPageContext.Provider>;

    async function refreshContext() {
        const [ data ] = await Promise.all( [
            GroupsPageLoaderFetch(),
            cache.GroupType.update(),
        ] );

        if ( data.success ) {
            context.groupTypes = data.types;
            context.setEdit( undefined );
            setErrors( undefined );
        } else {
            setErrors( data.reason );
        }
    }

    async function handleForm( form: ManageGroupTypeForm ) {
        if ( form.confirmed ) {
            const body = {
                label: form.body.label,
            };

            const res = edit
                ? await UniversimeApi.GroupType.update( edit.id, body )
                : await UniversimeApi.GroupType.create( body );
        }

        if ( form.action !== "CANCELED" )
            await refreshContext();

        setEdit( undefined );
    }
}

export type ManageGroupTypeForm = UniversiForm.Data<{
    label: string;
}>;
