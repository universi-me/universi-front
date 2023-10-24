
import {useState} from "react"

import "./SelectionBar.css"
import { ProfileContentListing } from "../ProfileContentListing/ProfileContentListing"
import { ProfileGroupListing } from "../ProfileGroupListing/ProfileGroupListing"
import { ProfileCurriculum } from "../ProfileCurriculum/ProfileCurriculum"
import { Vacancies } from "@/pages/Vacancies/Vacancies"

export function SelectionBar(){

    const [selectElement, setSelectelement] = useState("content")


    return(
        <>
            <div className="selection-bar">
                <div className="select-element" onClick={() => setSelectelement("content")}>
                    Conteúdos
                </div>
                <div className="select-element" onClick={() => setSelectelement("files")}>
                    Arquivos
                </div>
                <div className="select-element" onClick={() => setSelectelement("groups")}>
                    Grupos
                </div>
                <div className="select-element" onClick={() => setSelectelement("curriculum")}>
                    Currículo
                </div>
                <div className="select-element" onClick={() => setSelectelement("vacancies")}>
                    Vagas
                </div>
            </div>
            {getSelectElement(selectElement)}
        </>
    )


}


function getSelectElement(selectElement : string){
    if(selectElement == "content")
        return <ProfileContentListing/>
    if(selectElement == "files")
        return <ProfileContentListing filter="Documento"/>
    if(selectElement == "groups")
        return <ProfileGroupListing/>
    if(selectElement == "curriculum")
        return <ProfileCurriculum/>
    if(selectElement == "vacancies")
        return <Vacancies/>
}