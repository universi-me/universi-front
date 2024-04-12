import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { EMPTY_LIST_CLASS, GroupContext } from "@/pages/Group";
import { groupImageUrl, groupBannerUrl, groupHeaderUrl } from "@/utils/apiUtils";

import { GroupTypeToLabel, type Group, type GroupType } from "@/types/Group";
import "./GroupGroups.less";
import { Filter } from "@/components/Filter/Filter";
import { AuthContext } from "@/contexts/Auth";
import { ActionButton } from "@/components/ActionButton/ActionButton";
import { FormInputs, UniversiForm } from "@/components/UniversiForm/UniversiForm";
import { TextValidation } from "@/components/UniversiForm/Validation/TextValidation";
import UniversimeApi from "@/services/UniversimeApi";
import { OptionInMenu, hasAvailableOption, renderOption } from "@/utils/dropdownMenuUtils";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as SwalUtils from "@/utils/sweetalertUtils";
import { ValidationComposite } from "@/components/UniversiForm/Validation/ValidationComposite";

export function GroupGroups() {
    const groupContext = useContext(GroupContext);
    const [filterGroups, setFilterGroups] = useState<string>("");
    const authContext = useContext(AuthContext);

    if(groupContext == null)
        return <></>

    const OPTIONS_DEFINITION: OptionInMenu<Group>[] = [
        {
            text: "Editar",
            biIcon: "pencil-fill",
            onSelect(data) {
                groupContext.setEditGroup(data);
            },
            hidden() {
                return !(groupContext.group.canEdit);
            },
        },
        {
            text: "Excluir",
            biIcon: "trash-fill",
            onSelect(data) {
                handleRemoveGroup(data);
            },
            hidden(){
                return !(groupContext.group.canEdit);
            }
        }
    ];    

    //<ActionButton name="Editar este grupo" buttonProps={{onClick(){groupContext.setEditGroup(groupContext.group); console.log(groupContext.group)}}}/>
    //<ActionButton name="Criar grupo" buttonProps={{onClick(){groupContext.setEditGroup(null)}}}/>
    const GROUP_OPTIONS: OptionInMenu<Group>[] = [
        {
            text: "Editar este grupo",
            biIcon: "pencil-fill",
            onSelect(data) {
                groupContext.setEditGroup(groupContext.group)
            },
            hidden() {
                return !(groupContext.group.canEdit);
            },
        },
        {
            text: "Criar grupo",
            biIcon: "plus-lg",
            onSelect(data) {
                groupContext.setEditGroup(null);
            },
            hidden(){
                return !(groupContext.group.canEdit);
            }
        }
    ];

    function handleRemoveGroup(group : Group){
        let groupParentPath = group.path.substring(0, group.path.lastIndexOf("/"))
        SwalUtils.fireModal({
                title: "Deseja remover este grupo?",
                text: "Esta ação é irreversível.",

                showCancelButton: true,
                cancelButtonText: "Cancelar",
                confirmButtonText: "Ok",
                confirmButtonColor: "var(--wrong-invalid-color)"
        }).then(response =>{
            if(response.isConfirmed){
                UniversimeApi.Group.remove({groupPath: groupParentPath, groupIdRemove: group.id}).then(()=>{
                    groupContext?.refreshData();
                })
            }
        })
    }

    const availableGroupTypes = Object.entries(GroupTypeToLabel)
        .sort((a, b) => a[1].localeCompare(b[1]))
        .map((t) => ({ value: t[0] as GroupType, label: t[1] }));

    return (
        <section id="groups" className="group-tab">
            <div className="heading top-container">
                <div className="go-right">
                    <Filter setter={setFilterGroups} placeholderMessage={`Buscar grupos em ${groupContext.group.name}`}/>
                    <div className="group-options-container">
                        { !hasAvailableOption(GROUP_OPTIONS, groupContext.group) ? null :
                            <DropdownMenu.Root>
                                <DropdownMenu.Trigger asChild>
                                    <button className="group-options-button">
                                        <i className="bi bi-three-dots-vertical" />
                                    </button>
                                </DropdownMenu.Trigger>

                                <DropdownMenu.Content className="group-options" side="left">
                                    { GROUP_OPTIONS.map(def => renderOption(groupContext.group, def)) }
                                    <DropdownMenu.Arrow className="group-options-arrow" height=".5rem" width="1rem" />
                                </DropdownMenu.Content>
                            </DropdownMenu.Root>
                        }
                    </div>
                </div>
            </div>

            <div className="group-list tab-list"> { makeGroupList(groupContext.subgroups, filterGroups) } </div>
            {
                groupContext.editGroup !== undefined ?

                <UniversiForm
                    formTitle={groupContext.editGroup == null ? "Criar grupo" : "Editar grupo"}
                    objects={[
                        {
                            DTOName: "nickname", label: "Apelido do grupo", type: groupContext.editGroup == null ? FormInputs.TEXT : FormInputs.HIDDEN, value: undefined,
                            required: groupContext.editGroup == null,
                            validation: groupContext.editGroup == null ? new ValidationComposite<string>().addValidation(new TextValidation()) : undefined
                        }, {
                            DTOName: "name", label: "Nome do grupo", type: FormInputs.TEXT, value: groupContext.editGroup?.name, required: true, 
                            validation: new ValidationComposite<string>().addValidation(new TextValidation())
                        }, {
                            DTOName: "description", label: "Descrição do grupo", type: FormInputs.LONG_TEXT, value: groupContext.editGroup?.description, required: true, charLimit: 200,
                            validation: new ValidationComposite<string>().addValidation(new TextValidation())
                        }, {
                             DTOName: "imageUrl", label: "Imagem do grupo", type: FormInputs.IMAGE, value:undefined, 
                             defaultImageUrl: groupContext.editGroup ? groupImageUrl(groupContext.editGroup) : undefined,
                             crop: true, aspectRatio: 1,
                             required: false
                        }, {
                            DTOName: "bannerImageUrl", label: "Banner do grupo", type: FormInputs.IMAGE, value:undefined, 
                            defaultImageUrl: groupContext.editGroup ? groupBannerUrl(groupContext.editGroup) : undefined,
                            crop: true, aspectRatio: 2.5,
                            required: false
                        }, {
                            DTOName: "headerImageUrl", label: "Header do grupo", type: (groupContext.editGroup != null && groupContext.editGroup.rootGroup) ? FormInputs.IMAGE : FormInputs.HIDDEN, value:undefined, 
                            defaultImageUrl: groupContext.editGroup ? groupHeaderUrl(groupContext.editGroup) : undefined,
                            crop: true, //aspectRatio: 2.5,
                            required: false
                        }, {
                            DTOName: "groupType", label: "Tipo do grupo", type: FormInputs.SELECT_SINGLE, 
                            value: groupContext.editGroup ?  {value : groupContext.editGroup.type, label : groupContext.editGroup.type } : undefined, 
                            options: availableGroupTypes, required: true
                        }, {
                            DTOName: "canHaveSubgroup", label: "Pode criar grupo", type: FormInputs.BOOLEAN, value: groupContext.editGroup?.canCreateGroup
                        }, {
                            DTOName: "isPublic", label: "Grupo público", type: FormInputs.BOOLEAN, value: groupContext.editGroup?.publicGroup
                        }, {
                            DTOName: "canJoin", label: "Usuários podem entrar", type: FormInputs.BOOLEAN, value: groupContext.editGroup?.canEnter
                        }, {
                            DTOName: "isRootGroup", label: "Grupo raiz", type: FormInputs.HIDDEN, value: groupContext.editGroup?.rootGroup ?? false
                        }, {
                            DTOName: "parentGroupId", label: "Id do grupo pai (grupo atual)", type: FormInputs.HIDDEN, value: groupContext.group.id
                        }, {
                            DTOName: "everyoneCanPost", label: "Todos usuários podem postar", type: FormInputs.BOOLEAN, value: groupContext.group.everyoneCanPost
                        }, {
                            DTOName: "groupPath", label: "path", type: FormInputs.HIDDEN, value: groupContext.editGroup?.path
                        },

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
                { !hasAvailableOption(OPTIONS_DEFINITION, group) ? null :
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
