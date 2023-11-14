import { useState } from "react"
import "../GroupTabs/GroupTabs.less"
import "./GroupSubmenu.css"

export function GroupSubmenu({leave} : {leave : () => void}){

    const [isVisible, setIsVisible] = useState(false)

    return(
        <div className="group-tab-participacao submenu">
            <i className="bi bi-three-dots-vertical" onClick={() => setIsVisible(!isVisible)}></i>
            {
                <div className="box" 
                style={{
                    visibility: isVisible ? "visible" : "hidden", 
                    opacity: isVisible ? 1 : 0, 
                    marginTop: isVisible? "100%" : "0%",
                    scale: isVisible ? "1" : "0"
                }} onClick={leave}>
                    <p>Sair deste grupo</p>
                </div>
                
            }
        </div>
    )

}