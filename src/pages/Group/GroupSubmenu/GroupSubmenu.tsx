import { useContext, useState } from "react"
import "../GroupTabs/GroupTabs.less"
import "./GroupSubmenu.css"
import { GroupContext } from "../GroupContext"
import { AuthContext } from "@/contexts/Auth"

export function GroupSubmenu({leave} : {leave : () => void}){

    const [isVisible, setIsVisible] = useState(false)

    const context = useContext(GroupContext);
    const authContext = useContext(AuthContext);

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
        </div>
    )

}