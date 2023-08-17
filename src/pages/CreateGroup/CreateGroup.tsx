import { GroupTypeToLabel } from "@/types/Group";

export function CreateGroupPage() {
    return <form id="create-group-page">
        <fieldset className="name">
            <legend>Nome do grupo</legend>
            <input type="text" name="name" />
        </fieldset>

        <fieldset className="nickname">
            <legend>Nickname do grupo</legend>
            <input type="text" name="nickname" />
            {/* todo: disable nickname if updating existing group */}
        </fieldset>

        <fieldset className="type">
            <legend>Tipo do grupo</legend>
            <select defaultValue={"-1"} name="type">
                {/* Change defaultValue if updating existing group */}
                <option disabled value="-1">Selecione o tipo do grupo</option>
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
            <input type="url" name="image" />
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
    </form>;
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
