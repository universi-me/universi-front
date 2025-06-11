import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";

import { EMPTY_LIST_CLASS, GroupContext } from "@/pages/Group";
import { groupImageUrl } from "@/utils/apiUtils";

import "./GroupGroups.less";
import { Filter } from "@/components/Filter/Filter";
import { UniversimeApi } from "@/services"
import { OptionInMenu, hasAvailableOption, renderOption } from "@/utils/dropdownMenuUtils";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as SwalUtils from "@/utils/sweetalertUtils";
import { ActionButton } from "@/components/ActionButton/ActionButton";

export function GroupGroups() {
    const groupContext = useContext(GroupContext);
    const [filterGroups, setFilterGroups] = useState<string>("");

    if(groupContext == null)
        return <></>

    const regularGroups = groupContext.subgroups.filter( g => g.regularGroup );

    const OPTIONS_DEFINITION: OptionInMenu<Group.DTO>[] = [
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

    function handleRemoveGroup(group : Group.DTO){
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
                UniversimeApi.Group.remove( group.id! ).then(()=>{
                    groupContext?.refreshData();
                })
            }
        })
    }


    return (
        <section id="groups" className="group-tab">
            <div className="heading top-container">
                <div className="go-right">
                    <Filter setter={setFilterGroups} placeholderMessage={`Buscar grupos em ${groupContext.group.name}`}/>
                    {
                        groupContext.group.canEdit ?
                            <ActionButton name="Criar grupo" buttonProps={{onClick(){groupContext.setEditGroup(null)}}}/>
                        : <></>
                    }
                </div>
            </div>

            <div className="group-list tab-list"> { makeGroupList(regularGroups, filterGroups) } </div>
        </section>
    );
    function makeGroupList(groups: Group.DTO[], filter: string) {
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

    function renderGroup(group: Group.DTO) {
        const linkToGroup = `/group${group.path}`;

        return (
            <div className="group-item tab-item" key={group.id}>
                <Link to={linkToGroup}>
                    <img className="group-image" src={ groupImageUrl( group ) } />
                </Link>

                <div className="info">
                    <Link to={linkToGroup} className="group-name">{group.name}</Link>
                    <div className="group-description" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize( group.description ?? "" ) }} />
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
