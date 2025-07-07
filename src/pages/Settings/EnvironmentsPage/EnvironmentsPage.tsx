import { useReducer, useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import * as Switch from "@radix-ui/react-switch";
import { motion, AnimatePresence } from "framer-motion";

import { SettingsTitle, SettingsDescription } from "@/pages/Settings";
import { UniversimeApi } from "@/services";

import { type EnvironmentsLoaderResponse, EnvironmentsFetch } from "./EnvironmentsLoader";
import { type GroupEnvironmentUpdate_RequestDTO } from "@/services/UniversimeApi/GroupEnvironment";
import "./EnvironmentsPage.less";
import TextboxFormatted from "@/components/TextboxFormatted/TextboxFormatted";
import { AuthContext } from "@/contexts/Auth";
import { useContext } from "react";

export function EnvironmentsPage() {
    const data = useLoaderData() as EnvironmentsLoaderResponse;
    const authContext = useContext(AuthContext);

    const [fetchEnvironmentsItems, setFetchEnvironmentsItems] = useState<GroupEnvironmentUpdate_RequestDTO>({});
    const [environmentsItems, setEnvironmentsItems] = useState<Array<EnvironmentField>>([]);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

    const [editedItems, setEditedItems] = useReducer((state: GroupEnvironmentUpdate_RequestDTO, action: EditedItemsAction) => {
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
                title: "Organização",
                items: [
                    {
                        name: "Nome da Organização",
                        key: "organization_name",
                        type: "string",
                        defaultValue: authContext.organization.name,
                    },
                    {
                        name: "Id da Organização",
                        key: "organization_nickname",
                        type: "string",
                        defaultValue: authContext.organization.nickname,
                    },
                ]
            },
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
                    {
                        name: "Recuperar Conta",
                        key: "recovery_enabled",
                        type: "boolean",
                        defaultValue: true,
                    },
                ]
            },
            {
                title: "Email",
                items: [
                    {
                        name: "Habilitar",
                        key: "email_enabled",
                        type: "boolean",
                        defaultValue: false,
                    },
                    {
                        name: "Email Host",
                        key: "email_host",
                        type: "string",
                        defaultValue: "",
                    },
                    {
                        name: "Email Port",
                        key: "email_port",
                        type: "string",
                        defaultValue: "587",
                    },
                    {
                        name: "Email Protocol",
                        key: "email_protocol",
                        type: "string",
                        defaultValue: "smtp",
                    },
                    {
                        name: "Email User",
                        key: "email_username",
                        type: "string",
                        defaultValue: "",
                    },
                    {
                        name: "Email Password",
                        key: "email_password",
                        secure: true,
                        type: "string",
                        defaultValue: "",
                    },
                ]
            },
            {
                title: "Notificações via Email",
                items: [
                    {
                        name: "Notificar Novo Conteúdo No Grupo",
                        key: "message_new_content_enabled",
                        type: "boolean",
                        defaultValue: true,
                    },
                    {
                        name: "Template de Email para Novo Conteúdo",
                        key: "message_template_new_content",
                        type: "textbox-html",
                        imageUploadPublic: true,
                        defaultValue: "Olá, {{ groupName }} tem um novo conteúdo: {{ contentName }}.<br/><br/>Acesse: {{ contentUrl }}",
                        description: "groupName: Nome do Grupo.\ncontentName: Nome do Conteúdo.\ncontentUrl: Link do Conteúdo.",
                        descriptionBootstrapIcon: "bi-info-circle",
                    },
                    {
                        name: "Notificar Conteúdo Atribuído",
                        key: "message_assigned_content_enabled",
                        type: "boolean",
                        defaultValue: true,
                    },
                    {
                        name: "Template de Email para Conteúdo Atribuído",
                        key: "message_template_assigned_content",
                        type: "textbox-html",
                        imageUploadPublic: true,
                        defaultValue: "Olá {{ toUser }}, você recebeu um novo conteúdo de {{ fromUser }}: {{ contentName }}.<br/><br/>Acesse: {{ contentUrl }}",
                        description: "contentName: Nome do Conteúdo.\ncontentUrl: Link do Conteúdo.\nfromUser: Nome do autor da atribuição.\ntoUser: Nome do usuário que foi alvo da atribuição.",
                        descriptionBootstrapIcon: "bi-info-circle",
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
                        name: "Texto do Botão",
                        key: "google_login_text",
                        type: "string",
                        defaultValue: "EMAIL GOOGLE"
                    },
                    {
                        name: "Imagem do Botão",
                        key: "google_login_image_url",
                        type: "string",
                        defaultValue: "https://lh3.googleusercontent.com/d_S5gxu_S1P6NR1gXeMthZeBzkrQMHdI5uvXrpn3nfJuXpCjlqhLQKH_hbOxTHxFhp5WugVOEcl4WDrv9rmKBDOMExhKU5KmmLFQVg"
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
                title: "Login via Keycloak - OIDC",
                description: "Requer configurar o Realm, Client ID, Client Secret, habilitar a opção Autenticação de Cliente, Standard Flow e adicionar á lista de url de redirecionamento válidos ao Keycloak.",
                descriptionBootstrapIcon: "bi-info-circle",
                items: [
                    {
                        name: "Habilitar",
                        key: "keycloak_enabled",
                        type: "boolean",
                        defaultValue: false,
                    },
                    {
                        name: "Texto do Botão",
                        key: "keycloak_login_text",
                        type: "string",
                        defaultValue: "Keycloak"
                    },
                    {
                        name: "Imagem do Botão",
                        key: "keycloak_login_image_url",
                        type: "string",
                        defaultValue: "https://i.imgur.com/pKFFuoh.png"
                    },
                    {
                        name: "Auth URL",
                        key: "keycloak_url",
                        type: "string",
                        defaultValue: "",
                    },
                    {
                        name: "Redirect URL",
                        key: "keycloak_redirect_url",
                        type: "string",
                        defaultValue: window.location.origin + "/keycloak-oauth-redirect",
                    },
                    {
                        name: "Realm",
                        key: "keycloak_realm",
                        type: "string",
                        defaultValue: "",
                    },
                    {
                        name: "Client ID",
                        key: "keycloak_client_id",
                        type: "string",
                        defaultValue: "",
                    },
                    {
                        name: "Client Secret",
                        key: "keycloak_client_secret",
                        type: "string",
                        secure: true,
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
    }, [data, authContext.organization]);

    const toggleSection = (title: string) => {
        setExpandedSections((prev) => ({ ...prev, [title]: !prev[title] }));
    };

    return <div id="environments-settings">
        <SettingsTitle>Variáveis Ambiente</SettingsTitle>
        <SettingsDescription>Aqui você pode configurar as variáveis ambiente para algumas funcionalidades da plataforma.</SettingsDescription>

        <section className="environments-list">
            {environmentsItems.map((section) => (
                <div className="environments-item" key={section.title}>
                    <h3 onClick={() => toggleSection(section.title)} className="section-header">
                        <span className="section-title">{section.title}</span>
                        <span id="toggle-icon" className={expandedSections[section.title] ? "bi bi-chevron-down extended" : "bi bi-chevron-down collapsed"}></span>
                    </h3>
                    <AnimatePresence>
                        {expandedSections[section.title] && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="section-content"
                            >
                                {section.items.map((item) => (
                                    <div className="environments-row-content" key={item.key}>
                                        <div className="enabled-delete-wrapper" key={item.name}>
                                            <div className="environments-label">{item.name}</div>
                                            <div className="row-item">
                                                {item.type === "boolean" && (
                                                    <div className="enabled-wrapper">
                                                        {getValue(item) ? "Ativado" : "Desativado"}
                                                        <Switch.Root className="filter-enabled-root" checked={!!getValue(item)} onCheckedChange={makeToggleFilter(item)}>
                                                            <Switch.Thumb className="filter-enabled-thumb" />
                                                        </Switch.Root>
                                                    </div>
                                                )}
                                                {item.type === "string" && (
                                                    <div className="environments-text-wrapper">
                                                        <input type={item.secure ? "password" : "text"} className="environments-text-input" value={getValue(item) ?? ""} onChange={(e) => setTextValue(item, e)} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        { item.type === "textbox" ? (
                                            <div className="">
                                                <div className="enabled-delete-wrapper row-item environments-text-wrapper environments-text-input">
                                                    <textarea rows={8} className="environments-text-area" value={getValue(item)??""} onChange={(e) => setTextValue(item, e)} />
                                                </div>
                                            </div>
                                        ) : null}

                                        { item.type === "textbox-html" ? (
                                            <div className="">
                                                <div className="enabled-delete-wrapper row-item environments-text-wrapper environments-text-input">
                                                    <TextboxFormatted value={getValue(item)??""} imageUploadPublic={item.imageUploadPublic} onChange={(e) => setTextValueString(item, e)} />
                                                </div>
                                            </div>
                                        ) : null}

                                        { item.description ? (
                                            <div className="environments-description">
                                                <div className={ (item.descriptionBootstrapIcon ? "description-bi bi " + item.descriptionBootstrapIcon : "")}>
                                                    <div className="text">{item.description}</div>
                                                </div>
                                            </div>
                                        ) : null}

                                    </div>
                                ))}
                            
                            { section.description ? (
                                <div className="section-description">
                                    <div className={ (section.descriptionBootstrapIcon ? "description-bi bi " + section.descriptionBootstrapIcon : "")}>
                                        <div className="text">{section.description}</div>
                                    </div>
                                </div>
                            ) : null}

                            <div className="section-botton" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </section>
        <br/>

        <div className="buttons-wrapper">
            <button type="button" className="submit" onClick={submitChanges} disabled={!canSave} title={canSave ? undefined : "Faça uma alteração para poder salvar"}>Salvar alterações</button>
        </div>
    </div>;

    function getValue(item: EnvironmentItem) {
        return editedItems[item.key] ?? fetchEnvironmentsItems[item.key] ?? item.defaultValue;
    }

    function setTextValue(item: EnvironmentItem, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setTextValueString(item, event.target.value);
    }

    function setTextValueString(item: EnvironmentItem, value: string) {
        setEditedItems({ type: 'EDIT', id: item.key, value: value });
    }

    function makeToggleFilter(item: EnvironmentItem) {
        return function (checked: boolean) {
            setEditedItems({ type: 'EDIT', id: item.key, value: checked });
        };
    }

    async function submitChanges() {
        await UniversimeApi.GroupEnvironment.update(editedItems);
        refreshPage();
    }

    async function refreshPage() {
        await authContext.updateLoggedUser();
        const newData = await EnvironmentsFetch();
        setFetchEnvironmentsItems(newData.envDic);
        setEditedItems({ type: 'RESET' });
    }
}

type EditedItemsAction = {
    type: "RESET";
} | {
    type: "EDIT";
    id: keyof GroupEnvironmentUpdate_RequestDTO;
    value: unknown;
};

type EnvironmentField = {
    title: string;
    items: EnvironmentItem[];
    description?: string;
    descriptionBootstrapIcon?: string;
};

type EnvironmentItem = {
    name: string;
    key: keyof GroupEnvironmentUpdate_RequestDTO;
    imageUploadPublic?: boolean;
    description?: string;
    descriptionBootstrapIcon?: string;
    type: "boolean" | "string" | "textbox" | "textbox-html";
    defaultValue: any;
    secure?: boolean;
};
