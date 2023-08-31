import UniversimeApi from "@/services/UniversimeApi";
import { GroupType, GroupTypeToLabel } from "@/types/Group";
import "./CreateGroup.less"

export function CreateGroupPage() {

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
                <select defaultValue={""} name="type">
                    <option disabled value="">Selecione o tipo do grupo</option>
                    {
                        Object.entries(GroupTypeToLabel)
                            .map(([groupType, groupTypeLabel]) => {
                                return <option value={groupType} key={groupType}>{groupTypeLabel}</option>
                            })
                    }
                </select>
            </fieldset>

            <fieldset className="image">
                <legend>Imagem do grupo</legend>
                <img src="" alt="" />
                <input type="url" name="image" placeholder="Insira a URL para a imagem do grupo" />
            </fieldset>

            <fieldset className="canCreateGroup">
                <legend>Pode ter subgrupos?</legend>
                <input type="checkbox" name="canCreateGroup" />
            </fieldset>

            <fieldset className="publicGroup">
                <legend>É um grupo público?</legend>
                <input type="checkbox" name="publicGroup" />
            </fieldset>

            <fieldset className="canEnter">
                <legend>Qualquer pessoa pode entrar?</legend>
                <input type="checkbox" name="canEnter" />
            </fieldset>

            <fieldset className="groupId">
                <legend>Grupo pai</legend>
                <input type="checkbox" name="groupRoot" />
                {/* todo: select parent group */}
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
    const groupRootElement = pageElement.querySelector('input[name="groupRoot"]') as HTMLInputElement;

    return {
        name: nameElement.value,
        description: descriptionElement.value,
        nickname: nicknameElement.value,
        type: groupTypeElement.value as GroupType,
        imageUrl: imageElement.value,
        canCreateGroup: canCreateGroupElement.checked,
        publicGroup: publicGroupElement.checked,
        canEnter: canEnterElement.checked,
        groupRoot: groupRootElement.checked,
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
