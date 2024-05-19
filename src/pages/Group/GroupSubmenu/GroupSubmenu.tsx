import { useContext, useState } from "react"
import "../GroupTabs/GroupTabs.less"
import "./GroupSubmenu.css"
import { GroupContext } from "../GroupContext"
import { FormInputs, UniversiForm } from "@/components/UniversiForm/UniversiForm"
import { ValidationComposite } from "@/components/UniversiForm/Validation/ValidationComposite"
import { groupBannerUrl, groupHeaderUrl, groupImageUrl } from "@/utils/apiUtils"
import { GroupType, GroupTypeToLabel } from "@/types/Group"
import UniversimeApi from "@/services/UniversimeApi"
import { TextValidation } from "@/components/UniversiForm/Validation/TextValidation"
import { AuthContext } from "@/contexts/Auth"

export function GroupSubmenu({leave} : {leave : () => void}){

    const [isVisible, setIsVisible] = useState(false)

    const context = useContext(GroupContext);
    const authContext = useContext(AuthContext);

    const availableGroupTypes = Object.entries(GroupTypeToLabel)
        .sort((a, b) => a[1].localeCompare(b[1]))
        .map((t) => ({ value: t[0] as GroupType, label: t[1] }));

    return(
        <div className="submenu">
            <i className="bi bi-three-dots-vertical dots" onClick={() => setIsVisible(!isVisible)}></i>
            <div className={`box ${isVisible && !context?.group.rootGroup ? "visible" : "hidden"}`} 
            onClick={leave}>
                <i className="bi bi-door-open"></i>
                <p>Sair deste grupo</p>
            </div>

            <div className={`box ${isVisible && context?.group.canEdit ? "visible" : "hidden"}`}
            onClick={() => {context?.setEditGroup(context.group);}}>
                <i className="bi bi-pencil-fill"></i>
                <p>Editar este grupo</p>
            </div>
            <div className={`box ${isVisible && authContext.user?.accessLevel == "ROLE_ADMIN" ? "visible" : "hidden"}`}
            onClick={() => {context?.setGroupConfigModalOpen(true)}}>
                <i className="bi bi-gear"></i>
                <p>Configurações</p>
            </div>

            {
                context?.editGroup !== undefined  ?

                <UniversiForm
                    formTitle={context.editGroup == null ? "Criar grupo" : "Editar grupo"}
                    objects={[
                        {
                            DTOName: "nickname", label: "Apelido do grupo", type: context.editGroup == null ? FormInputs.TEXT : FormInputs.HIDDEN, value: undefined,
                            required: context.editGroup == null,
                            validation: context.editGroup == null ? new ValidationComposite<string>().addValidation(new TextValidation()) : undefined
                        }, {
                            DTOName: "name", label: "Nome do grupo", type: FormInputs.TEXT, value: context.editGroup?.name, required: true, 
                            validation: new ValidationComposite<string>().addValidation(new TextValidation())
                        }, {
                            DTOName: "description", label: "Descrição do grupo", type: FormInputs.LONG_TEXT, value: context.editGroup?.description, required: true, charLimit: 200,
                            validation: new ValidationComposite<string>().addValidation(new TextValidation())
                        }, {
                             DTOName: "imageUrl", label: "Imagem do grupo", type: FormInputs.IMAGE, value:undefined, 
                             defaultImageUrl: context.editGroup ? groupImageUrl(context.editGroup) : undefined,
                             crop: true, aspectRatio: 1,
                             required: false
                        }, {
                            DTOName: "bannerImageUrl", label: "Banner do grupo", type: FormInputs.IMAGE, value:undefined, 
                            defaultImageUrl: context.editGroup ? groupBannerUrl(context.editGroup) : undefined,
                            crop: true, aspectRatio: 2.5,
                            required: false
                        }, {
                            DTOName: "headerImageUrl", label: "Logo da Organização", type: (context.editGroup != null && context.editGroup.rootGroup) ? FormInputs.IMAGE : FormInputs.HIDDEN, value:undefined, 
                            defaultImageUrl: context.editGroup ? groupHeaderUrl(context.editGroup) : undefined,
                            crop: true, //aspectRatio: 2.5,
                            required: false
                        }, {
                            DTOName: "groupType", label: "Tipo do grupo", type: FormInputs.SELECT_SINGLE, 
                            value: context.editGroup ?  {value : context.editGroup.type, label : context.editGroup.type } : undefined, 
                            options: availableGroupTypes, required: true
                        }, {
                            DTOName: "canHaveSubgroup", label: "Pode criar grupo", type: FormInputs.BOOLEAN, value: context.editGroup?.canCreateGroup
                        }, {
                            DTOName: "isPublic", label: "Grupo público", type: FormInputs.BOOLEAN, value: context.editGroup?.publicGroup
                        }, {
                            DTOName: "canJoin", label: "Usuários podem entrar", type: FormInputs.BOOLEAN, value: context.editGroup?.canEnter
                        }, {
                            DTOName: "isRootGroup", label: "Grupo raiz", type: FormInputs.HIDDEN, value: context.editGroup?.rootGroup ?? false
                        }, {
                            DTOName: "parentGroupId", label: "Id do grupo pai (grupo atual)", type: FormInputs.HIDDEN, value: context.group.id
                        }, {
                            DTOName: "everyoneCanPost", label: "Todos usuários podem postar", type: FormInputs.BOOLEAN, value: context.group.everyoneCanPost
                        }, {
                            DTOName: "groupPath", label: "path", type: FormInputs.HIDDEN, value: context.editGroup?.path
                        },

                    ]}
                    requisition={context.editGroup ? UniversimeApi.Group.update : UniversimeApi.Group.create}
                    callback={()=>{context.setEditGroup(undefined); context.refreshData()}}
                />
                :
                <></>
            }
                
        </div>
    )

}