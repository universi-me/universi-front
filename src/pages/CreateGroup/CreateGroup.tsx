import Select from "react-select";
import * as Switch from "@radix-ui/react-switch"
import { useLoaderData } from "react-router-dom";

import UniversimeApi from "@/services/UniversimeApi";
import { GroupType, GroupTypeToLabel } from "@/types/Group";
import { EDIT_GROUP_PARAMETER, ManageGroupLoaderResponse } from "@/pages/CreateGroup";

import "./CreateGroup.less"

export function CreateGroupPage() {
    const { availableGroupTypes, availableParents, editedGroup } = useLoaderData() as ManageGroupLoaderResponse;

    return <div id="create-group-page">
        <div className="heading">{ !editedGroup ? "Criar grupo" : "Editar grupo" }</div>
        <form className="manage-group-form">
            <fieldset className="name">
                <legend>Nome do grupo</legend>
                <input type="text" name="name" placeholder="Insira o nome do grupo" defaultValue={editedGroup?.name ?? ""} />
            </fieldset>

            <fieldset className="nickname">
                <legend>Nickname do grupo</legend>
                <input type="text" name="nickname" placeholder="Insira o nickname do grupo"
                    disabled={!!editedGroup} defaultValue={editedGroup?.nickname ?? ""}
                    title={!editedGroup ? undefined : "Você não pode mudar o nickname de um grupo que já existe"} />
            </fieldset>

            <fieldset className="description">
                <legend>Descrição do grupo</legend>
                <textarea name="description" placeholder="Insira a descrição do grupo" defaultValue={editedGroup?.description ?? ""} />
            </fieldset>

            <fieldset className="type">
                <legend>Tipo do grupo</legend>
                <Select
                    placeholder="Selecionar tipo de grupo"
                    name="type"
                    options={availableGroupTypes}
                    className="react-select"
                    classNamePrefix="react-select-option"
                    isClearable={false}

                    defaultValue={
                        editedGroup?.type === undefined
                            ? undefined
                            : { label: GroupTypeToLabel[editedGroup.type], value: editedGroup.type.toString()}
                    }
                />
            </fieldset>

            <fieldset className="image">
                <legend>Imagem do grupo</legend>
                <input type="url" name="image" placeholder="Insira a URL para a imagem do grupo" defaultValue={editedGroup?.image ?? ""} />
            </fieldset>

            <fieldset className="canCreateGroup one-line-fieldset">
                <div className="fieldset-legend">Pode ter subgrupos</div>
                <Switch.Root name="canCreateGroup" className="radix-switch-root" defaultChecked={editedGroup?.canCreateGroup ?? false} >
                    <Switch.Thumb className="radix-switch-thumb" />
                </Switch.Root>
            </fieldset>

            <fieldset className="publicGroup one-line-fieldset">
                <div className="fieldset-legend">É um grupo público?</div>
                <Switch.Root name="publicGroup" className="radix-switch-root" defaultChecked={editedGroup?.publicGroup ?? false} >
                    <Switch.Thumb className="radix-switch-thumb" />
                </Switch.Root>
            </fieldset>

            <fieldset className="canEnter one-line-fieldset">
                <div className="fieldset-legend">Qualquer pessoa pode entrar?</div>
                <Switch.Root name="canEnter" className="radix-switch-root" defaultChecked={editedGroup?.canEnter ?? false} >
                    <Switch.Thumb className="radix-switch-thumb" />
                </Switch.Root>
            </fieldset>

            <fieldset className="groupId">
                <legend>Grupo pai</legend>
                <Select
                    placeholder="Selecionar grupo pai"
                    name="parentGroupId"
                    options={availableParents}
                    className="react-select"
                    classNamePrefix="react-select-option"
                    isClearable={true}
                    isSearchable={true}

                    isDisabled={ !!editedGroup }
                    defaultValue={
                        !editedGroup
                            ? undefined 
                            : { label: "Você não pode mudar o grupo pai de um grupo já existente", value: "" }
                    }
                />
            </fieldset>

            <button className="save-group" type="button" onClick={!editedGroup ? createGroup : editGroup}>
                { !editedGroup ? "Criar grupo" : "Atualizar grupo" }
            </button>
        </form>
    </div>;
}

function getValuesFromPage() {
    const pageElement = document.querySelector("#create-group-page") as HTMLFormElement;

    const nameElement = pageElement.querySelector('input[name="name"]') as HTMLInputElement;
    const descriptionElement = pageElement.querySelector('textarea[name="description"]') as HTMLTextAreaElement;
    const groupTypeElement = pageElement.querySelector('input[name="type"]') as HTMLSelectElement;
    const imageElement = pageElement.querySelector('input[name="image"]') as HTMLInputElement;
    const canCreateGroupElement = pageElement.querySelector('input[name="canCreateGroup"]') as HTMLInputElement;
    const publicGroupElement = pageElement.querySelector('input[name="publicGroup"]') as HTMLInputElement;
    const canEnterElement = pageElement.querySelector('input[name="canEnter"]') as HTMLInputElement;

    return {
        name: nameElement.value,
        description: descriptionElement.value,
        type: groupTypeElement.value as GroupType,
        imageUrl: imageElement.value,
        canCreateGroup: canCreateGroupElement.checked,
        publicGroup: publicGroupElement.checked,
        canEnter: canEnterElement.checked,
    };
}

function getCreateOnlyValuesFromPage() {
    const pageElement = document.querySelector("#create-group-page") as HTMLFormElement;

    const nicknameElement = pageElement.querySelector('input[name="nickname"]') as HTMLInputElement;
    const parentGroupId = pageElement.querySelector('input[name="parentGroupId"]') as HTMLInputElement;
    const hasParentGroup = parentGroupId.value !== "";

    return {
        nickname: nicknameElement.value,
        groupRoot: !hasParentGroup,
        parentGroupId: hasParentGroup ? parentGroupId.value : undefined,
    }
}

function editGroup() {
    const groupId = new URL(document.URL).searchParams.get(EDIT_GROUP_PARAMETER);
    if (groupId === null) {
        createGroup();
        return;
    }

    const values = getValuesFromPage();
    UniversimeApi.Group.update({
        groupId,

        name:            values.name,
        description:     values.description,
        groupType:       values.type,
        canHaveSubgroup: values.canCreateGroup,
        isPublic:        values.publicGroup,
        canJoin:         values.canEnter,
        imageUrl:        values.imageUrl,
    });
}

function createGroup() {
    const values = getValuesFromPage();
    const createValues = getCreateOnlyValuesFromPage();

    UniversimeApi.Group.create({
        name:            values.name,
        nickname:        createValues.nickname,
        description:     values.description,
        groupType:       values.type,
        canHaveSubgroup: values.canCreateGroup,
        isPublic:        values.publicGroup,
        canJoin:         values.canEnter,
        imageUrl:        values.imageUrl,
        isRootGroup:     createValues.groupRoot,
        parentGroupId:   createValues.parentGroupId,
    })
        .then(r => {
            console.dir(r)
        });
}
