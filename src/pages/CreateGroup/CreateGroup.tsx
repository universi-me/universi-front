import UniversimeApi from "@/services/UniversimeApi";
import { GroupType, GroupTypeToLabel } from "@/types/Group";
import { useEffect, useState } from "react";
import Select, { OptionsOrGroups } from "react-select";
import * as Switch from "@radix-ui/react-switch"
import "./CreateGroup.less"

type ReactSelectOption = {
    label: string;
    value: string;
};

export function CreateGroupPage() {
    const [availableParents, setAvailableParents] = useState<OptionsOrGroups<ReactSelectOption, never>>([]);
    const availableGroupTypes: ReactSelectOption[] = Object.entries(GroupTypeToLabel).map(([groupType, label]) => {
        return {
            label,
            value: groupType,
        };
    });

    useEffect(() => {
        UniversimeApi.Group.availableParents()
            .then(res => {
                if (res.success && res.body !== undefined) {
                    const options = res.body.groups.map((g): ReactSelectOption => {
                        return {
                            label: g.name,
                            value: g.id,
                        };
                    });

                    setAvailableParents(options);
                }
            })
    }, []);

    // todo: Change defaultValues if updating existing group
    return <div id="create-group-page">
        {/* Update heading to "Editar grupo" when editing */}
        <div className="heading">Criar grupo</div>
        <form className="manage-group-form">
            <fieldset className="name">
                <legend>Nome do grupo</legend>
                <input type="text" name="name" placeholder="Insira o nome do grupo" />
            </fieldset>

            <fieldset className="nickname">
                <legend>Nickname do grupo</legend>
                <input type="text" name="nickname" placeholder="Insira o nickname do grupo" />
                {/* todo: disable nickname if updating existing group */}
            </fieldset>

            <fieldset className="description">
                <legend>Descrição do grupo</legend>
                <textarea name="description" placeholder="Insira a descrição do grupo" />
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
                />
            </fieldset>

            <fieldset className="image">
                <legend>Imagem do grupo</legend>
                <img src="" alt="" />
                <input type="url" name="image" placeholder="Insira a URL para a imagem do grupo" />
            </fieldset>

            <fieldset className="canCreateGroup one-line-fieldset">
                <div className="fieldset-legend">Pode ter subgrupos</div>
                <Switch.Root name="canCreateGroup" className="radix-switch-root">
                    <Switch.Thumb className="radix-switch-thumb" />
                </Switch.Root>
            </fieldset>

            <fieldset className="publicGroup one-line-fieldset">
                <div className="fieldset-legend">É um grupo público?</div>
                <Switch.Root name="publicGroup" className="radix-switch-root">
                    <Switch.Thumb className="radix-switch-thumb" />
                </Switch.Root>
            </fieldset>

            <fieldset className="canEnter one-line-fieldset">
                <div className="fieldset-legend">Qualquer pessoa pode entrar?</div>
                <Switch.Root name="canEnter" className="radix-switch-root">
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
                />
            </fieldset>

            <button type="button" onClick={createGroup}>Criar grupo</button>
            {/* todo: change to "Atualizar grupo" if updating existing group */}
        </form>
    </div>;
}

function getValuesFromPage() {
    const pageElement = document.querySelector("#create-group-page") as HTMLFormElement;

    const nameElement = pageElement.querySelector('input[name="name"]') as HTMLInputElement;
    const nicknameElement = pageElement.querySelector('input[name="nickname"]') as HTMLInputElement;
    const descriptionElement = pageElement.querySelector('textarea[name="description"]') as HTMLTextAreaElement;
    const groupTypeElement = pageElement.querySelector('select[name="type"]') as HTMLSelectElement;
    const imageElement = pageElement.querySelector('input[name="image"]') as HTMLInputElement;
    const canCreateGroupElement = pageElement.querySelector('input[name="canCreateGroup"]') as HTMLInputElement;
    const publicGroupElement = pageElement.querySelector('input[name="publicGroup"]') as HTMLInputElement;
    const canEnterElement = pageElement.querySelector('input[name="canEnter"]') as HTMLInputElement;
    const parentGroupId = pageElement.querySelector('input[name="parentGroupId"]') as HTMLInputElement;

    const hasParentGroup = parentGroupId.value !== "";

    return {
        name: nameElement.value,
        description: descriptionElement.value,
        nickname: nicknameElement.value,
        type: groupTypeElement.value as GroupType,
        imageUrl: imageElement.value,
        canCreateGroup: canCreateGroupElement.checked,
        publicGroup: publicGroupElement.checked,
        canEnter: canEnterElement.checked,
        groupRoot: !hasParentGroup,
        parentGroupId: hasParentGroup ? parentGroupId.value : undefined,
    };
}

function createGroup() {
    const values = getValuesFromPage();
    UniversimeApi.Group.create({
        name:            values.name,
        nickname:        values.nickname,
        description:     values.description,
        groupType:       values.type,
        canHaveSubgroup: values.canCreateGroup,
        isPublic:        values.publicGroup,
        canJoin:         values.canEnter,
        imageUrl:        values.imageUrl,
        isRootGroup:     values.groupRoot,
        parentGroupId:   values.parentGroupId,
    })
        .then(r => {
            console.dir(r)
        });
}

/* 
Inputs:
    - name : string
    - description : string
    - type : GroupType
    - imageUrl : string (URL)
    - canCreateGroup : boolean (Group can only have subgroup if true)
    - publicGroup : boolean
    - canEnter : boolean

Create-only inputs:
    - groupRoot : boolean (Group is Master Group if true)
    - groupId : string (Parent group id)
    - nickname : string
*/
