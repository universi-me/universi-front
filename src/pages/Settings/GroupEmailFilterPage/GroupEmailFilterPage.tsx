import { useReducer, useContext } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import * as Switch from "@radix-ui/react-switch"
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { AuthContext } from "@/contexts/Auth";
import { SettingsTitle, SettingsDescription } from "@/pages/Settings";
import { ActionButton } from "@/components/ActionButton/ActionButton";
import { UniversimeApi } from "@/services"
import { type OptionInMenu, renderOption } from "@/utils/dropdownMenuUtils";
import * as SwalUtils from "@/utils/sweetalertUtils";

import { type GroupEmailFilterLoaderResponse, GroupEmailFilterFetch } from "./GroupEmailFilterLoader";
import { GroupEmailFilterTypeToLabel, type GroupEmailFilter, type GroupEmailFilterType } from "@/types/Group";
import "./GroupEmailFilter.less";

let NEW_FILTER_ID = 0;

export function GroupEmailFilterPage() {
    const auth = useContext(AuthContext);
    const data = useLoaderData() as GroupEmailFilterLoaderResponse;
    const navigate = useNavigate();
    const [emailFilters, emailFiltersDispatch] = useReducer(emailFilterReducer, data.emailFilters);

    if (emailFilters === undefined) {
        SwalUtils.fireModal({
            title: "Erro ao recuperar filtros de email",
            text: "Não foi possível recuperar os filtros de email",

            showCancelButton: false,
            showConfirmButton: true,
            confirmButtonText: "Voltar",
        }).then(v => navigate("/settings"));

        return null;
    }

    const currentEmailFilters = emailFilters.filter(f => f.state !== "DELETED");
    const canSave = undefined !== emailFilters.find(f => f.state !== undefined);

    const FILTER_TYPE_OPTIONS: OptionInMenu<EmailFilterOnList>[] = Object.keys(GroupEmailFilterTypeToLabel).map(type => ({
        text: GroupEmailFilterTypeToLabel[type as GroupEmailFilterType],
        onSelect(data) {
            emailFiltersDispatch({ type: "EDIT", filter: { ...data, type: type as GroupEmailFilterType } });
        },
    }));


    return <div id="email-filter-settings">
        <SettingsTitle>Filtros de email</SettingsTitle>
        <SettingsDescription>Aqui você pode configurar quais emails são permitidos para cadastrar na plataforma.</SettingsDescription>

        <ActionButton name="Criar filtro" buttonProps={{
            onClick() {emailFiltersDispatch({type: "CREATE"})},
            className: "create-new-filter",
        }}/>

        <section className="email-filter-list">
        { currentEmailFilters.length === 0 ? <p className="empty-list">Nenhum filtro para excluir.</p> : currentEmailFilters.map(filter => {
            return <div className="email-filter-item" key={filter.id}>
                <div className="enabled-delete-wrapper">
                    <div className="enabled-wrapper">
                        <Switch.Root className="filter-enabled-root" checked={filter.enabled} value={filter.id} onCheckedChange={makeToggleFilter(filter)}>
                            <Switch.Thumb className="filter-enabled-thumb" />
                        </Switch.Root>
                        { filter.enabled ? "Ativado" : "Desativado" }
                    </div>

                    <button type="button" className="delete-button" onClick={makeDeleteFilter(filter)}>
                        <span className="bi bi-trash-fill" />
                    </button>
                </div>

                <div className="filter-type-email-wrapper">
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild disabled={!filter.enabled}>
                            <button type="button" className="filter-type-trigger">
                                { GroupEmailFilterTypeToLabel[filter.type] }
                                <span className="bi" />
                            </button>
                        </DropdownMenu.Trigger>

                        <DropdownMenu.Content className="filter-type-dropdown-menu" side="top">
                            { FILTER_TYPE_OPTIONS.map(def => renderOption(filter, def)) }
                        </DropdownMenu.Content>
                    </DropdownMenu.Root>

                    <input type="text" className="filter-email-input" value={filter.email} disabled={!filter.enabled} onChange={e => emailFiltersDispatch({type: "EDIT", filter: {...filter, email: e.currentTarget.value}})} />
                </div>
            </div>
        })}
        </section>

        <div className="buttons-wrapper">
            <button type="button" className="submit" onClick={submitChanges} disabled={!canSave} title={canSave ? undefined : "Faça uma alteração para poder salvar"}>Salvar alterações</button>
        </div>
    </div>

    function emailFilterReducer(state: EmailFilterOnList[] | undefined, action: EmailFilterReducerAction): EmailFilterOnList[] | undefined {
        if (state === undefined)
            return undefined;

        if (action.type === "CREATE") {
            return [...state, { added: "", email: "@exemplo.com", enabled: true, id: (--NEW_FILTER_ID).toString(), type: "END_WITH", state: "NEW" }];
        }

        if (action.type === "DELETE") {
            const filter = state.find(f => f.id === action.id)!;

            if (filter.state === "NEW") {
                return state.filter(f => f.id !== action.id);
            }

            else {
                return state.map(f => f.id === action.id ? {...f, state: "DELETED"} : f);
            }
        }

        if (action.type === "EDIT") {
            const newFilter: EmailFilterOnList = {
                ...action.filter,
                state: action.filter.state !== "NEW" ? "EDITED" : "NEW",
            }

            return state.map(f => f.id === action.filter.id ? newFilter : f);
        }

        if (action.type === "SET") {
            return action.value;
        }
    }

    function makeToggleFilter(filter: EmailFilterOnList) {
        return function(checked: boolean) {
            emailFiltersDispatch({
                type: "EDIT",
                filter: {...filter, enabled: checked},
            });
        }
    }

    function makeDeleteFilter(filter: EmailFilterOnList) {
        return function() {
            SwalUtils.fireModal({
                title: "Deseja deletar esse filtro?",
                text: "Essa ação não pode ser desfeita.",

                showCancelButton: true,
                cancelButtonText: "Cancelar",
                confirmButtonText: "Deletar",
                confirmButtonColor: "var(--wrong-invalid-color)"
            }).then(response => {
                if (response.isConfirmed) {
                    emailFiltersDispatch({
                        type: "DELETE",
                        id: filter.id,
                    });
                }
            });
        }
    }

    async function submitChanges() {
        const toCreateFilters = emailFilters!.filter(f => f.state === "NEW");
        const toEditFilters = emailFilters!.filter(f => f.state === "EDITED");
        const toDeleteResponses = emailFilters!.filter(f => f.state === "DELETED");

        Promise.all([
            Promise.all(toCreateFilters.map(f => UniversimeApi.Group.addEmailFilter({ email: f.email, groupId: auth.organization!.id, isEnabled: f.enabled, type: f.type }))),
            Promise.all(toEditFilters.map(f => UniversimeApi.Group.editEmailFilter({ emailFilterId: f.id, groupId: auth.organization!.id, email: f.email, isEnabled: f.enabled, type: f.type }))),
            Promise.all(toDeleteResponses.map(f => UniversimeApi.Group.deleteEmailFilter({ emailFilterId: f.id, groupId: auth.organization!.id }))),
        ]).then(([createRes, editRes, deleteRes]) => {
            const failedCreate = createRes.filter(f => !f.success);
            const failedEdit = editRes.filter(f => !f.success);
            const failedDelete = deleteRes.filter(f => !f.success);

            if (failedCreate.length + failedEdit.length + failedDelete.length === 0) {
                refreshPage();
                return;
            }

            const errorBuilder: string[] = [];
            failedCreate.forEach(c => {
                errorBuilder.push(`Ao criar filtro: ${c.message}`);
            });
            failedEdit.forEach(c => {
                errorBuilder.push(`Ao editar filtro: ${c.message}`);
            });
            failedDelete.forEach(c => {
                errorBuilder.push(`Ao deletar filtro: ${c.message}`);
            });

            refreshPage();

            SwalUtils.fireModal({
                title: "Erro ao salvar filtros",
                html: errorBuilder.join("<br/>"),
                icon: "error",
            });
        })
    }

    async function refreshPage() {
        const newData = await GroupEmailFilterFetch(auth.organization!.id);

        emailFiltersDispatch({
            type: "SET",
            value: newData.emailFilters,
        });
    }
}

type EmailFilterOnList = GroupEmailFilter & { state?: "NEW" | "EDITED" | "DELETED"; };

type EmailFilterReducerAction = { type: "CREATE"; } | { type: "DELETE"; id: string; } | { type: "EDIT"; filter: EmailFilterOnList; } | { type: "SET", value: EmailFilterOnList[] | undefined };
