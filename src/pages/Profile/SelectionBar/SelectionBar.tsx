
import {useState} from "react"

import "./SelectionBar.css"
import { ProfileContentListing } from "../ProfileContentListing/ProfileContentListing"
import { ProfileGroupListing } from "../ProfileGroupListing/ProfileGroupListing"

export function SelectionBar(){

    const [selectElement, setSelectelement] = useState("content")


    return(
        <>
            <div className="selection-bar">
                <div className="select-element" onClick={() => setSelectelement("content")}>
                    Conteúdos
                </div>
                {/* <div className="select-element" onClick={() => setSelectelement("files")}>
                    Arquivos
                </div> */}
                <div className="select-element" onClick={() => setSelectelement("groups")}>
                    Grupos
                </div>
            </div>
            {getSelectElement(selectElement)}
        </>
    )


}


function getSelectElement(selectElement : string){
    if(selectElement == "content")
        return <ProfileContentListing title="Conteúdos"/>
    if(selectElement == "files")
        return <ProfileContentListing title="Arquivos"/>
    if(selectElement == "groups")
        return <ProfileGroupListing/>
}