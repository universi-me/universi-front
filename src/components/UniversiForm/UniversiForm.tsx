import { ApiResponse } from "@/types/UniversimeApi"
import { ReactNode, useState, useContext, ChangeEvent } from "react"

import "./ManageMaterial.less"
import "./UniversiForm.less"
import { CATEGORY_SELECT_STYLES, GroupContext } from "@/pages/Group"
import UniversimeApi from "@/services/UniversimeApi"
import { arrayBufferToBase64 } from "@/utils/fileUtils"
import Select from "react-select"

export type formProps = {

    objects: FormObject[],
    requisition : any,
    afterSave? : any,
    isNew? : boolean,
    cancelClick : () => void,
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
    listObjects? : any[]
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
            if(!updatedObjects[index].value)
                updatedObjects[index].value = []
            updatedObjects[index].value.push(newValue);
            return updatedObjects
        })
    }

    function getListInput(object : FormObject, index : number){
        return(
            <div>
                <legend>{object.label}</legend>
                <Select placeholder={`Selecionar ${object.label}`} className="category-select" isMulti={object.isListMulti} options={object.listObjects}
                onChange={(value) => handleSelectChange(index, value)}
                noOptionsMessage={()=>`Não foi possível encontrar ${object.label}`}
                classNamePrefix="category-item"
                styles={CATEGORY_SELECT_STYLES}
                defaultValue={null}
                />

            </div>
        )
    }

    function getNumberInput(object : FormObject, index : number){
        return <></>
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
        if(props.afterSave)
            props.afterSave()
    }

    return(        
        <div className="manage-material fields">

        <div className="header">
            <img src="/assets/imgs/create-content.png" />
            <h1 className="title">{ (props.isNew ? "Criar " : "Editar ")+props.formTitle } </h1>
        </div>

        {
        renderObjects()
        }   

        <section className="operation-buttons">
            <button type="button" className="cancel-button" onClick={props.cancelClick}>
                <i className="bi bi-x-circle-fill" />
                Cancelar
            </button>
            <button type="button" className="submit-button" onClick={makeRequest} /*disabled={!canSave} title={canSave ? undefined : "Preencha os dados antes de salvar"}*/>
                <i className="bi bi-check-circle-fill" />
                Salvar
            </button>
        </section>
        </div>
    )

}