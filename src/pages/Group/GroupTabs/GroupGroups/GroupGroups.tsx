import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { EMPTY_LIST_CLASS, GroupContext } from "@/pages/Group";
import { groupImageUrl } from "@/utils/apiUtils";

import type { Group } from "@/types/Group";
import "./GroupGroups.less";
import { Filter } from "@/components/Filter/Filter";
import { AuthContext } from "@/contexts/Auth";
import { ActionButton } from "@/components/ActionButton/ActionButton";
import { FormInputs, UniversiForm } from "@/components/UniversiForm/UniversiForm";
import { TextValidation } from "@/components/UniversiForm/Validation/TextValidation";
import UniversimeApi from "@/services/UniversimeApi";
import { OptionInMenu, hasAvailableOption, renderOption } from "@/utils/dropdownMenuUtils";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export function GroupGroups() {
    const groupContext = useContext(GroupContext);
    const [filterGroups, setFilterGroups] = useState<string>("");
    const authContext = useContext(AuthContext);

    if(groupContext == null)
        return

    const OPTIONS_DEFINITION: OptionInMenu<Group>[] = [
        {
            text: "Editar",
            biIcon: "pencil-fill",
            onSelect(data) {
                groupContext.setEditGroup(data);
            },
            hidden() {
                return (groupContext?.group.admin.id !== groupContext?.loggedData.profile.id || groupContext.loggedData.profile.id == groupContext.group.organization?.admin.id);
            },
        }
    ];

    const groupTypes = [
        ["INSTITUTION", "Instituição"],
        ["CAMPUS", "Campus"],
        ["COURSE", "Curso"],
        ["PROJECT", "Projeto"],
        ["CLASSROOM", "Sala de aula"],
        ["MONITORIA", "Monitoria"],
        ["LABORATORY", "Laboratório"],
        ["ACADEMIC_CENTER", "Centro acadêmico"],
        ["DEPARTMENT", "Departamento"],
        ["STUDY_GROUP", "Grupo de estudo"]
    ]

    return (
        <section id="groups" className="group-tab">
            <div className="heading top-container">
                <div className="go-right">
                    <Filter setter={setFilterGroups} placeholderMessage={`Buscar grupos em ${groupContext.group.name}`}/>
                    {
                        (groupContext.loggedData.profile.id == groupContext.group.admin.id || groupContext.loggedData.profile.id == groupContext.group.organization?.admin.id) && (groupContext.group.canCreateGroup) ? 
                        <ActionButton name="Criar grupo" buttonProps={{onClick(){groupContext.setEditGroup(null)}}}/>
                        : <></>
                    }
                </div>
            </div>

            <div className="group-list tab-list"> { makeGroupList(groupContext.subgroups, filterGroups) } </div>
            {
                groupContext.editGroup !== undefined ?

                <UniversiForm
                    formTitle={groupContext.editGroup == null ? "Criar grupo" : "Editar grupo"}
                    objects={[
                        {DTOName: "nickname", label: "Apelido do grupo", type: FormInputs.TEXT, value: groupContext.editGroup?.name, required: true, validation: new TextValidation},
                        {DTOName: "name", label: "Nome do grupo", type: FormInputs.TEXT, value: groupContext.editGroup?.nickname, required: true, validation: new TextValidation},
                        {DTOName: "description", label: "Descrição do grupo", type: FormInputs.LONG_TEXT, value: groupContext.editGroup?.description, required: true, validation: new TextValidation},
                        {DTOName: "imageUrl", label: "Imagem do grupo", type: FormInputs.IMAGE, value: groupContext.editGroup ? groupImageUrl(groupContext.editGroup) : undefined},
                        {DTOName: "groupType", label: "Tipo do grupo", type: FormInputs.LIST, value: groupContext.editGroup?.type, listObjects: groupTypes.map((t) => ({value: t[0], label: t[1]})), required: true, },
                        {DTOName: "canHaveSubgroup", label: "Pode criar grupo", type: FormInputs.BOOLEAN, value: groupContext.editGroup?.canCreateGroup},
                        {DTOName: "isPublic", label: "Grupo público", type: FormInputs.BOOLEAN, value: groupContext.editGroup?.publicGroup},
                        {DTOName: "canJoin", label: "Usuários podem entrar", type: FormInputs.BOOLEAN, value: groupContext.editGroup?.canEnter},
                        {DTOName: "isRootGroup", label: "Grupo raiz", type: FormInputs.BOOLEAN, value: groupContext.editGroup?.rootGroup},
                        {DTOName: "parentGroupId", label: "Id do grupo pai (grupo atual)", type: FormInputs.NONE, value: groupContext.group.id},
                    ]}
                    requisition={groupContext.editGroup ? UniversimeApi.Group.update : UniversimeApi.Group.create}
                    callback={()=>{groupContext.setEditGroup(undefined); groupContext.refreshData()}}
                />
                :
                <></>
            }
        </section>
    );
    function makeGroupList(groups: Group[], filter: string) {
        if (groups.length === 0) {
            return <p className={EMPTY_LIST_CLASS}>Esse grupo não possui grupos.</p>
        }

        const filteredGroups = filter.length === 0
            ? groups
            : groups.filter(c => c.name.toLowerCase().includes(filter.toLowerCase()));

        if (filteredGroups.length === 0) {
            return <p className={EMPTY_LIST_CLASS}>Nenhum grupo encontrado com a pesquisa.</p>
        }

        return filteredGroups
            .map(renderGroup);
    }

    function renderGroup(group: Group) {
        const linkToGroup = `/group${group.path}`;

        return (
            <div className="group-item tab-item" key={group.id}>
                <Link to={linkToGroup}>
                    <img className="group-image" src={groupImageUrl(group)} />
                </Link>

                <div className="info">
                    <Link to={linkToGroup} className="group-name">{group.name}</Link>
                    <p className="group-description">{group.description}</p>
                </div>
                { !hasAvailableOption(OPTIONS_DEFINITION) ? null :
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                            <button className="group-options-button">
                                <i className="bi bi-three-dots-vertical" />
                            </button>
                        </DropdownMenu.Trigger>

                        <DropdownMenu.Content className="group-options" side="left">
                            { OPTIONS_DEFINITION.map(def => renderOption(group, def)) }
                            <DropdownMenu.Arrow className="group-options-arrow" height=".5rem" width="1rem" />
                        </DropdownMenu.Content>
                    </DropdownMenu.Root>
                }
            </div>
        );
    }
}
