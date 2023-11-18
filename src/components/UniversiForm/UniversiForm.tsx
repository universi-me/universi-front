import { ApiResponse } from "@/types/UniversimeApi"
import { ReactNode, useState, useContext } from "react"

import "./ManageMaterial.less"
import { GroupContext } from "@/pages/Group"
import UniversimeApi from "@/services/UniversimeApi"

export type formProps = {

    objects: FormObject[],
    requisition : any
    
}

export type FormObject = {
    DTOName : string,
    label : string,
    type : FormInputs,
    charLimit? : undefined | number,
    fileType? : undefined | string,
    value? : undefined | any,
    required? : undefined | boolean
}

export enum FormInputs {
    TEXT,
    LONG_TEXT,
    FILE,
    URL,
    LIST,
    NONE
}

export function UniversiForm(props : formProps){

    const [objects, setObjects] = useState<FormObject[]>(props.objects);
    const MAX_TEXT_LENGTH = 50
    const MAX_LONG_TEXT_LENGTH = 150
    const MAX_URL_LENGTH = 100

    const context = useContext(GroupContext)

    const handleChange = (index : number, newValue : any) => {
        setObjects((oldObjects) =>{
            const updatedObjects = [...oldObjects]
            updatedObjects[index].value = newValue;
            return updatedObjects
        })
    }

    function getCharLimit(object : FormObject){
        if(object.type == FormInputs.TEXT)
            return MAX_TEXT_LENGTH;
        else if(object.type == FormInputs.LONG_TEXT)
            return MAX_LONG_TEXT_LENGTH
        else
            return MAX_URL_LENGTH
        return undefined;
    }

    function getInput(object : FormObject){
        if(object.type == FormInputs.TEXT || object.type == FormInputs.LONG_TEXT || object.type == FormInputs.URL)
            return "text"
        else if(object.type == FormInputs.FILE)
            return "file"
    }

    function renderObjects() : ReactNode{
        return objects.map((object, index) =>(
            object.type == FormInputs.NONE ? <></> : 
            <fieldset key={index}>
                <legend>
                    {object.label}
                    {
                        object.charLimit != undefined
                        ?
                        <div className="char-counter">
                            {object.value?.length}/{object.charLimit}
                        </div>
                        :
                        <div className="char-counter">
                            {object.value?.length}/{object.type == FormInputs.TEXT ? MAX_TEXT_LENGTH : object.type === FormInputs.LONG_TEXT ? MAX_LONG_TEXT_LENGTH : MAX_URL_LENGTH}
                        </div>
                    }
                </legend>
                <input className="field-input" type={`${getInput(object)}`} defaultValue={object.value} onChange={(e) => {handleChange(index, e.target.value)}} maxLength={getCharLimit(object)}/>
            </fieldset>
        
        ))
    }

    const convertToDTO = (formObjects: FormObject[]) => {
        return formObjects.reduce((formData, currentObject) => {
            formData[currentObject.DTOName] = currentObject.value;
            return formData;
        }, {} as Record<string, any>);
    };

    function makeRequest(){
        props.requisition(convertToDTO(objects))
    }

    return(
        <div className="manage-material fields">
        {
        renderObjects()
        }   
        <section className="operation-buttons">
            <button type="button" className="cancel-button" onClick={() => {context?.setEditMaterial(undefined)}}>
                <i className="bi bi-x-circle-fill" />
                Cancelar
            </button>
            <button type="button" className="submit-button" onClick={makeRequest} /*disabled={!canSave} title={canSave ? undefined : "Preencha os dados antes de salvar"}*/>
                <i className="bi bi-check-circle-fill" />
                "Salvar"
            </button>
        </section>
        </div>
    )

}