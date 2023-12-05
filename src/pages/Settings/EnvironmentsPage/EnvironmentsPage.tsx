import { useReducer, useState, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import * as Switch from "@radix-ui/react-switch"

import { SettingsTitle, SettingsDescription } from "@/pages/Settings";
import UniversimeApi from "@/services/UniversimeApi";

import { type EnvironmentsLoaderResponse, EnvironmentsFetch } from "./EnvironmentsLoader";
import "./EnvironmentsPage.less";

export function EnvironmentsPage() {
    const data = useLoaderData() as EnvironmentsLoaderResponse;

    const [fetchEnvironmentsItems, setFetchEnvironmentsItems] = useState<any>({});
    const [environmentsItems, setEnvironmentsItems] = useState<Array<{}>>([]);

    const [editedItems, setEditedItems] = useReducer((state:any, action:any) => {
        switch (action.type) {
          case 'RESET':
            return {};
          case 'EDIT':
            return { ...state, [action.id]: action.value };
          default:
            return state;
        }
    }, {});

    const canSave = Object.keys(editedItems).length > 0;
    
    useEffect(() => {

        setFetchEnvironmentsItems(data.envDic);

        setEnvironmentsItems([
            {
                title: "Conta",
                items: [
                    {
                        name: "Habilitar Registrar-se",
                        key: "signup_enabled",
                        type: "boolean",
                        defaultValue: true,
                    },
                    {
                        name: "Confirmar Conta ao Registrar-se",
                        key: "signup_confirm_account_enabled",
                        type: "boolean",
                        defaultValue: false,
                    },
                ]
            },
            {
                title: "Login via Google",
                items: [
                    {
                        name: "Habilitar",
                        key: "login_google_enabled",
                        type: "boolean",
                        defaultValue: false,
                    },
                    {
                        name: "Client ID",
                        key: "google_client_id",
                        type: "string",
                        defaultValue: "",
                    },
                ]
            },
            {
                title: "reCAPTCHA Enterprise",
                items: [
                    {
                        name: "Habilitar",
                        key: "recaptcha_enabled",
                        type: "boolean",
                        defaultValue: false,
                    },
                    {
                        name: "Api Key",
                        key: "recaptcha_api_key",
                        type: "string",
                        defaultValue: "",
                    },
                    {
                        name: "Api Project Id",
                        key: "recaptcha_api_project_id",
                        type: "string",
                        defaultValue: "",
                    },
                    {
                        name: "Site Key",
                        key: "recaptcha_site_key",
                        type: "string",
                        defaultValue: "",
                    },
                ]
            },
        ]);

    }, [data]);

    return <div id="environments-settings">
        <SettingsTitle>Variáveis Ambiente</SettingsTitle>
        <SettingsDescription>Aqui você pode configurar as variáveis ambiente para algumas funcinalidades da plataforma.</SettingsDescription>

        <section className="environments-list">
        {environmentsItems.map((section : any) => (
            <div className="environments-item" key={section.title}>
            <h3>{section.title}</h3>
            {section.items.map((item : any) => (
                <div className="enabled-delete-wrapper" key={item.name}>
                    <div className="environments-label">{item.name}</div>
                    { item.type === "boolean" ? (
                        <div className="enabled-delete-wrapper">
                            <div className="enabled-wrapper">
                                {getValue(item) ? "Ativado" : "Desativado"}
                                <Switch.Root className="filter-enabled-root" checked={getValue(item)} onCheckedChange={makeToggleFilter(item)} >
                                    <Switch.Thumb className="filter-enabled-thumb" />
                                </Switch.Root>
                            </div>
                        </div>
                    ) : null}
                    { item.type === "string" ? (
                        <div className="environments-text-wrapper">
                            <input type="text" className="environments-text-input" value={getValue(item)??""} onChange={(e) => setTextValue(item, e)} />
                        </div>
                    ) : null}
            </div>
            ))}
            </div>
        ))}
        </section>
        <br/>
        <div className="buttons-wrapper">
            <button type="button" className="submit" onClick={submitChanges} disabled={!canSave} title={canSave ? undefined : "Faça uma alteração para poder salvar"}>Salvar alterações</button>
        </div>
    </div>


    function getValue(item: any) {
        return editedItems[item.key] !== undefined ? editedItems[item.key] : fetchEnvironmentsItems[item.key] ?? item.defaultValue;
    }

    function setTextValue(item: any, event: React.ChangeEvent<HTMLInputElement>) {
        setEditedItems({ type: 'EDIT', id: item.key, value: event.target.value });
    }

    function makeToggleFilter(item: any) {
        return function (checked: boolean) {
            setEditedItems({ type: 'EDIT', id: item.key, value: checked });
        };
    }

    async function submitChanges() {
        const response = await UniversimeApi.Group.editEnvironments(editedItems);
        refreshPage();
    }

    async function refreshPage() {
        const newData = await EnvironmentsFetch();
        setFetchEnvironmentsItems(newData.envDic);
        setEditedItems({ type: 'RESET' });
    }
}

