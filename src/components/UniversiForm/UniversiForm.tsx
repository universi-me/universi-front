import { ReactNode, useState, useContext, ChangeEvent, useEffect } from "react"

import "./ManageMaterial.less"
import "./UniversiForm.less"
import { CATEGORY_SELECT_STYLES, GroupContext } from "@/pages/Group"
import UniversimeApi from "@/services/UniversimeApi"
import { arrayBufferToBase64 } from "@/utils/fileUtils"
import Select from "react-select"
import { UniversiModal } from "../UniversiModal"
import { Validation } from "./Validation/Validation"
import { object } from "prop-types"
import { RequiredValidation } from "./Validation/RequiredValidation"

export type formProps = {

    objects: FormObject[],
    requisition : any,
    callback : () => void,
    formTitle : string
    
}

export type FormObject = {
    DTOName : string,
    label : string,
    type : FormInputs,
    charLimit? : undefined | number,
    fileType? : undefined | string,
    value? : undefined | any | any[],
    required? : undefined | boolean,
    options? : undefined | any[],
    file?: undefined | any,
    isListMulti? : true | undefined,
    listObjects? : any[],
    validation? : Validation
}

export enum FormInputs {
    TEXT,
    LONG_TEXT,
    FILE,
    URL,
    LIST,
    BOOLEAN,
    IMAGE,
    NONE,
    NUMBER
}

export function UniversiForm(props : formProps){

    const [objects, setObjects] = useState<FormObject[]>(props.objects);
    const [canSave, setCanSave] = useState<boolean>(false)
    const MAX_TEXT_LENGTH = 50
    const MAX_LONG_TEXT_LENGTH = 150
    const MAX_URL_LENGTH = 100

    const context = useContext(GroupContext)
    const DEFAULT_IMAGE_PATH = "/assets/imgs/default-content.png";

    useEffect(()=>{

        objects.forEach(obj => { 
            if(obj.type in [FormInputs.TEXT, FormInputs.LONG_TEXT, FormInputs.URL] && !obj.charLimit){
                obj.charLimit = obj.type == FormInputs.TEXT ? MAX_TEXT_LENGTH : obj.type == FormInputs.LONG_TEXT ? MAX_LONG_TEXT_LENGTH : MAX_URL_LENGTH;
            }
            if(!obj.validation && obj.required)
                obj.validation = new RequiredValidation
        })

    }, [])

    useEffect(()=>{

        let isValid = true

        objects.forEach(obj => {
            if(obj.validation && !obj.validation.validate(obj)) {
                isValid = false
            }
        });
        setCanSave(isValid)
        
    }, [objects])

    const handleChange = (index : number, newValue : any) => {
        setObjects((oldObjects) =>{
            const updatedObjects = [...oldObjects]
            updatedObjects[index].value = newValue;
            return updatedObjects
        })
    }
    const handleFileChange = (index : number, newValue : any) => {
        setObjects((oldObjects) =>{
            const updatedObjects = [...oldObjects]
            updatedObjects[index].file = newValue;
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

    function getTextInput(object : FormObject, index : number){
        return (
            <>
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
                <input className="field-input" type="text" defaultValue={object.value} onChange={(e) => {handleChange(index, e.target.value)}} maxLength={getCharLimit(object)}/>
            </>
        )
    }

    function getImageBuffer(object : FormObject){
        if(object.value)
            return "data:image/jpeg;base64,"+arrayBufferToBase64(object.file);
        return DEFAULT_IMAGE_PATH
    }

    function getImageInput(object : FormObject, index : number){

        const imageBuffer = getImageBuffer(object)

        return(
            <div className="image-wrapper">
                <img src={imageBuffer} className={"image-preview "+((imageBuffer === DEFAULT_IMAGE_PATH) ? "default-image" : "")}/>
                <fieldset className="label-button">
                    <legend>{object.label}</legend>
                    <input type="file" style={{display: "none"}} id="file-input" accept="image/*" onChange={(e) =>{changeFile(e, index)}}/>
                    <label htmlFor="file-input" className="image-button">
                        Selecionar arquivo
                    </label>
                </fieldset>
            </div>
        )

    }

    async function changeFile(e : ChangeEvent<HTMLInputElement>, index: number){
        const imageFile = e.currentTarget.files?.item(0);
        if(!imageFile){
            handleFileChange(index, undefined);
            return;
        }

        const reader = new FileReader();
        reader.onloadend = renderLoadedImage;
        reader.readAsArrayBuffer(imageFile)

        async function renderLoadedImage(this: FileReader, ev: ProgressEvent<FileReader>){
            if(ev.target?.readyState == FileReader.DONE && ev.target.result){
                handleFileChange(index, ev.target.result as ArrayBuffer)
                const imageFile = (document.getElementById("file-input") as HTMLInputElement).files?.item(0) 
                if(imageFile){
                    const res = await UniversimeApi.Image.upload({image: imageFile})
                    if(res.success && res.body)
                        handleChange(index, res.body.link)
                }
                
            }
        }
    }

    function getBooleanInput(object : FormObject, index : number){

        return(

            <div className="checkbox-input">
                <fieldset>
                    <legend>{object.label}</legend>
                    <input id={index.toString()} name={index.toString()} checked={object.value} type="checkbox" className="field-input checkbox" onChange={(e) =>{handleChange(index, e.target.checked)}}></input>
                </fieldset>
            </div>

        )
    }

    const handleSelectChange = (index : number, newValue : any) => {
        setObjects((oldObjects) =>{
            const updatedObjects = [...oldObjects]
            if(!updatedObjects[index].value && updatedObjects[index].isListMulti)
                updatedObjects[index].value = []
            if(updatedObjects[index].isListMulti){
                newValue.forEach((value : any) =>{
                updatedObjects[index].value.push(value.value);
                })
            }
            else
                updatedObjects[index].value = newValue.value
            return updatedObjects
        })
    }

    function getListInput(object : FormObject, index : number){
        if(!object.listObjects)
            return
        return(
            <div>
                <legend>{object.label}</legend>
                <Select placeholder={`Selecionar ${object.label}`} className="category-select" isMulti={object.isListMulti} options={object.listObjects}
                onChange={(value) => handleSelectChange(index, value)}
                noOptionsMessage={()=>`Não foi possível encontrar ${object.label}`}
                classNamePrefix="category-item"
                styles={CATEGORY_SELECT_STYLES}
                defaultValue={object.value}
                />

            </div>
        )
    }

    function getNumberInput(object : FormObject, index : number){
        return(
            <>
                <legend>{object.label}</legend>
                <input max={object.charLimit} type="number" value={object.value} className="field-input" onChange={(e) => {handleNumberChange(index, e.target.value)}}/>
            </>
        )
    }

    function handleNumberChange(index : number, newValue : any){

        const obj = objects[index]

        if(!obj)
            return

        if(obj.charLimit && newValue > obj.charLimit)
            newValue = obj.charLimit

        handleChange(index, newValue)

    }

    function renderObjects() : ReactNode{
        return objects.map((object, index) =>(
            object.type == FormInputs.NONE ? <></> : 
            <fieldset key={index}>
                {
                    object.type == FormInputs.TEXT ||
                    object.type == FormInputs.LONG_TEXT ||
                    object.type == FormInputs.URL ?
                    getTextInput(object, index)
                    : object.type == FormInputs.IMAGE ?
                    getImageInput(object, index)
                    : object.type == FormInputs.BOOLEAN ? 
                    getBooleanInput(object, index)
                    : object.type == FormInputs.LIST ?
                    getListInput(object, index)
                    : object.type == FormInputs.NUMBER ?
                    getNumberInput(object, index)
                    : <></>

                }
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
        if(props.callback)
            props.callback()
    }

    return(        
    <UniversiModal>
        <div id="manage-material">
            <div className="manage-material fields">

                <div className="header">
                    <img src="/assets/imgs/create-content.png" />
                    <h1 className="title">{ props.formTitle } </h1>
                </div>

                {
                renderObjects()
                }   

                <section className="operation-buttons">
                    <button type="button" className="cancel-button" onClick={props.callback}>
                        <i className="bi bi-x-circle-fill" />
                        Cancelar
                    </button>
                    <button type="button" className="submit-button" onClick={makeRequest} disabled={!canSave} title={canSave ? undefined : "Preencha os dados antes de salvar"}>
                        <i className="bi bi-check-circle-fill" />
                        Salvar
                    </button>
                </section>
            </div>
        </div>
    </UniversiModal>
    )

}