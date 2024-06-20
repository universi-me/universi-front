import { ReactNode, useState, useEffect } from "react"

import "./UniversiForm.less"
import UniversimeApi from "@/services/UniversimeApi"
import { arrayBufferToBase64 } from "@/utils/fileUtils"
import Select, { GroupBase, StylesConfig } from "react-select"
import CreatableSelect from "react-select/creatable"
import { UniversiModal } from "../UniversiModal"
import { RequiredValidation } from "./Validation/RequiredValidation"
import { ValidationComposite } from "./Validation/ValidationComposite"
import { makeClassName } from "@/utils/tsxUtils"
import * as SwalUtils from "@/utils/sweetalertUtils";
import { stringEqualsIgnoreCase } from "@/utils/stringUtils"
import { update } from "@/services/UniversimeApi/Group"
import CropperComponent from "../ImageCropper/ImageCropper"
import TextboxFormatted from "../TextboxFormatted/TextboxFormatted"

export type cancelPopup = {
    confirmCancel? : boolean,
    title? : string,
    message? : string,
    cancelButtonMessage? : string,
    confirmButtonMessage? : string,
    confirmButtonColor? : string,
    cancelButtonColor? : string,
}

export type formProps = {

    objects: FormObject[],
    requisition : any,
    callback?: () => any,
    formTitle : string,
    cancelProps? : cancelPopup,
    saveButtonText? : string,
    cancelButtonText? : string
}

type FormObjectBase<FormType extends FormInputs, ValueType> = {
    DTOName : string,
    label : string,
    type: FormType,

    value?: ValueType,
    required?: boolean,
    validation?: ValidationComposite<ValueType>,
    disabled?: (objects : FormObject[]) => boolean,
};

export type FormObjectText = FormObjectBase<FormInputs.TEXT | FormInputs.FORMATED_TEXT | FormInputs.LONG_TEXT | FormInputs.URL, string> & {
    charLimit?: number;
    renderCharCounter?: boolean;
};

export type FormObjectNumber = FormObjectBase<FormInputs.NUMBER, number> & {
    minValue?: number;
    maxValue?: number;
};

export type FormObjectBoolean = FormObjectBase<FormInputs.BOOLEAN, boolean>;
export type FormObjectRadio<T = string | number>  = FormObjectBase<FormInputs.RADIO, T> & {options : {label : string, value : T}[]};

export type FormObjectImage = FormObjectBase<FormInputs.IMAGE, string> & {
    defaultImageUrl?: string;
    aspectRatio?: number;
    crop?: boolean;
};

export type FormObjectFile = FormObjectBase<FormInputs.FILE, File> & {
    fileType?: string;
};

export type FormObjectHidden<T> = FormObjectBase<FormInputs.HIDDEN, T>;

export type FormObjectDate = FormObjectBase<FormInputs.DATE, string>;

export type FormObjectSelectSingle<T> = FormObjectBase<FormInputs.SELECT_SINGLE, T> & SelectProps<T> & { stylesConfig?: StylesConfig<SelectOption<T>, true, GroupBase<T & SelectOption<T>>> };
export type FormObjectSelectMulti<T> = FormObjectBase<FormInputs.SELECT_MULTI, T[]> & SelectProps<T> & { stylesConfig?: StylesConfig<SelectOption<T>, true, GroupBase<T&SelectOption<T>>> };
type SelectProps<T> = {
    canCreate?: boolean,
    onCreate?: (value : string) => any,
    options?: SelectOption<T>[],
};
type SelectOption<T> = {
    label: string,
    value: T
}

export type FormObject<T = any> = FormObjectText | FormObjectNumber | FormObjectBoolean | FormObjectImage | FormObjectDate | FormObjectFile | FormObjectHidden<T> | FormObjectSelectSingle<T> | FormObjectSelectMulti<T> | FormObjectRadio<T> ;

export enum FormInputs {
    TEXT,
    LONG_TEXT,
    URL,
    FILE,
    IMAGE,
    SELECT_SINGLE,
    SELECT_MULTI,
    BOOLEAN,
    HIDDEN,
    NUMBER,
    FORMATED_TEXT,
    DATE,
    RADIO
}

export function UniversiForm(props : formProps){

    const [objects, setObjects] = useState<FormObject[]>(props.objects);
    const [canSave, setCanSave] = useState<boolean>(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const MAX_TEXT_LENGTH = 50
    const MAX_LONG_TEXT_LENGTH = 150
    const MAX_URL_LENGTH = 2048;
    const MAX_FORMATED_TEXT_LENGTH = 2048;

    const DEFAULT_IMAGE_PATH = "/assets/imgs/default-content.png";

    useEffect(()=>{


        for(const obj of objects) {
            if ((obj.type === FormInputs.TEXT || obj.type === FormInputs.LONG_TEXT || obj.type === FormInputs.URL)) {
                if(!obj.charLimit){
                    obj.charLimit = obj.type === FormInputs.TEXT
                        ? MAX_TEXT_LENGTH
                        : obj.type === FormInputs.LONG_TEXT
                            ? MAX_LONG_TEXT_LENGTH
                            : MAX_URL_LENGTH;
                }
                if(obj.value == undefined)
                    obj.value = ""
            }

            if (!obj.validation) {
                obj.validation = ValidationComposite.generate(obj.type);
            }

            if (obj.required) {
                obj.validation.addValidation(new RequiredValidation());
            }

            if(obj.type == FormInputs.SELECT_MULTI){
                obj.value = (obj.value?.map((v : any) => v.value ? v.value : v))
            }

            if(obj.type == FormInputs.SELECT_SINGLE){
                obj.value = obj.value?.value ?? obj.value
            }

        }

    }, [])

    useEffect(()=>{

        let isValid = true

        objects.forEach(obj => {
            if(obj.validation && !obj.validation.validate(obj, objects)) {
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
    const handleFileChange = (index : number, newValue : File | undefined) => {
        setObjects((oldObjects) =>{
            const updatedObjects = [...oldObjects];
            const updatedObject = updatedObjects[index];

            if (updatedObject.type === FormInputs.IMAGE || updatedObject.type === FormInputs.FILE) {
                updatedObject.value = newValue;
                updatedObjects[index] = updatedObject;
            }

            return updatedObjects;
        })
    }



    function getCharLimit(object : FormObjectText){
        if (object.charLimit)
            return object.charLimit;

        switch (object.type) {
        case FormInputs.TEXT:
            return MAX_TEXT_LENGTH;
        case FormInputs.LONG_TEXT:
            return MAX_LONG_TEXT_LENGTH;
        case FormInputs.URL:
            return MAX_URL_LENGTH;
        case FormInputs.FORMATED_TEXT:
            return MAX_FORMATED_TEXT_LENGTH;
        }
    }

    function getTextInput(object : FormObjectText, index : number) {

        const [valueState, setValueState] = useState(object.value ?? "")
        const charLimit = getCharLimit(object);
        const renderCharCounter = object.renderCharCounter ?? object.type !== FormInputs.URL;

        useEffect(() => {
            handleContentChange()
        },[valueState])

        function validHtml(value : string){
            
            let validValue = ""

            if(value.trim() == "")
                return

            for(let line of value.split("<p>")){
                for(let line1 of line.split("</p>")){
                    if(line1.trim() != "<br>" && line1.trim() != ""){
                        validValue+="<p>"+line
                    }
                }
            }

            return validValue
        }

        function handleContentChange(){
            handleChange(index, object.type == FormInputs.FORMATED_TEXT ? validHtml(valueState) : valueState)
        }

        return (
            <>
                <legend>
                    {object.label}
                    {
                        renderCharCounter &&
                        <div className="char-counter">
                            {object.value?.length ?? 0}/{charLimit}
                        </div>
                    }
                </legend>
                {
                    object.type == FormInputs.LONG_TEXT ? 
                        <textarea rows={5} className="field-input" defaultValue={object.value} onChange={(e) => {handleChange(index, e.target.value)}} maxLength={getCharLimit(object)} required={object.required}/>
                    : object.type == FormInputs.FORMATED_TEXT ?
                        <TextboxFormatted value={valueState} onChange={setValueState}/>
                    :
                        <input className="field-input" type="text" defaultValue={object.value} onChange={(e) => {handleChange(index, e.target.value)}} maxLength={getCharLimit(object)} required={object.required}/>
                }
            </>
        )
    }

    function getImageInput(object : FormObjectImage, index : number){
        const [imageFile, setImageFile] = useState<File>();
        const [mimeType, setMimeType] = useState<string>('image/jpeg');
        const [imageBuffer, setImageBuffer] = useState<ArrayBuffer>();
        const [showCrop, setShowCrop] = useState<boolean>(false);

        useEffect(() => {
            if (!imageFile) {
                setImageBuffer(undefined);
                return;
            }

            const reader = new FileReader();
            reader.onloadend = async function (this, ev) {
                if (ev.target?.readyState == FileReader.DONE && ev.target.result) {
                    setMimeType(imageFile.type)
                    setImageBuffer(ev.target.result as ArrayBuffer);

                    if (!imageFile)
                        return;

                    if(object.crop && showCrop) {
                        return;
                    }

                    const res = await UniversimeApi.Image.upload({image: imageFile})
                    if(res.success && res.body)
                        handleChange(index, res.body.link)
                }
            };

            reader.readAsArrayBuffer(imageFile);

        }, [imageFile]);

        const renderedImageUrl = imageBuffer != undefined
            ? "data:" + mimeType + ";base64, " + arrayBufferToBase64(imageBuffer)
            : object.defaultImageUrl ? 
                object.defaultImageUrl
            : DEFAULT_IMAGE_PATH;

        const className = makeClassName([
            "image-preview",
            imageBuffer ? "default-image" : undefined,
        ]);

        const changeImage = (imageFile: File | undefined) => {
            if(object.crop) {
                setShowCrop(true);
            }
            setImageFile(imageFile)
        }

        function updateImageFromCrop(imageBlob: Blob) {
            if(!imageBlob) {
                return;
            }
            imageBlob.arrayBuffer().then((buff) => setImageBuffer(buff));
            setMimeType(imageBlob.type);
            setImageFile(new File([imageBlob], '', {type: mimeType}));
        }

        return(
            <div className="image-wrapper">
                <img src={renderedImageUrl} className={className}/>
                <fieldset className="label-button">
                    <legend>{object.label}</legend>
                    <input type="file" style={{display: "none"}} id={object.DTOName} accept="image/*" onChange={(e) =>{ changeImage(e.currentTarget.files?.item(0) ?? undefined) }} required={object.required}/>
                    <label htmlFor={object.DTOName} className="image-button">
                        Selecionar arquivo
                    </label>
                    <CropperComponent show={showCrop} src={renderedImageUrl as string} selectImage={updateImageFromCrop} willClose={() => setShowCrop(false)} options={{aspectRatio: object.aspectRatio,}} />
                </fieldset>
            </div>
        )

    }

    function getBooleanInput(object : FormObject, index : number){

        return(

            <div className="checkbox-input">
                <fieldset>
                    <legend>{object.label}</legend>
                    <input id={index.toString()} name={index.toString()} checked={object.value} type="checkbox" className="field-input checkbox" onChange={(e) =>{handleChange(index, e.target.checked)}} required={object.required}></input>
                </fieldset>
            </div>

        )
    }

    function getRadioInput(object : FormObjectRadio<string | number>, index : number){
        return (
            <div className="radio-input">
                <fieldset>
                    <legend>{object.label}</legend>
                    {
                        object.options.map((item, mapIndex) =>(
                            <label key={mapIndex}>
                                <input type={"radio"} name={`radio-${index}`} value={item.value} onChange={(e) => {handleChange(index, e.target.value)}} required={object.required}/>
                                {item.label}
                            </label>
                        ))
                    }
                    {/* <input id={index.toString()} name={index.toString()} checked={object.value} type="checkbox" className="field-input checkbox" onChange={(e) =>{handleChange(index, e.target.checked)}} required={object.required}></input> */}
                </fieldset>
            </div>
        )
    }


    function getListInput<T>(object : FormObjectSelectMulti<T> | FormObjectSelectSingle<T>, index : number){

        if(!object.options && !object.canCreate)
            return
        const [optionsList, setOptionsList] = useState(object.options);

        const [values, setDefaultValues] = useState<any>();

        useEffect(() => {

              if (object.type === FormInputs.SELECT_MULTI && optionsList && object.value) {

                let defaultValuesArr: { value: any, label: string }[] = []
                for (const option of optionsList) {
                  if (object.value.includes(option.value))
                    defaultValuesArr.push(option)
                }

                setDefaultValues(defaultValuesArr);

              } else if(object.type === FormInputs.SELECT_SINGLE){

                if(optionsList && object.value){
                    for(const option of optionsList){

                        if(object.value === option.value){
                            console.log("retornando: ", option);
                            let values = [];
                            values.push(option)
                            setDefaultValues(values);
                            break;
                        }
                    }
                }

              } else{
                setDefaultValues(null)
              }
        
          }, [object.type, object.options, object.value, optionsList]);
        

        // useEffect(()=>{
        //     if(object.type == FormInputs.SELECT_MULTI && object.options && object.value){
        //         let defaultValuesArr : {value : any, label : string}[] = []
        //         for(const option of object.options){
        //             if(object.value.includes(option.value))
        //                 defaultValuesArr.push(option)
        //         }

        //         setDefaultValues(defaultValuesArr)
        //         console.log(".", defaultValues)
        //         console.log(".", defaultValuesArr)

        //     }
        //     else
        //         setDefaultValues(getDefaultValueSingle(object.value, optionsList))
        // }, 
        // [])

        const handleSelectChange = (index : number, newValue : any) => {
            console.log(newValue)
            setDefaultValues(newValue)
            setObjects((oldObjects) =>{
                const updatedObjects = [...oldObjects];
                const updatedObject = updatedObjects[index];

                if (updatedObject.type === FormInputs.SELECT_SINGLE) {
                    updatedObject.value = newValue?.value ?? null;
                }

                else if(updatedObject.type === FormInputs.SELECT_MULTI){
                    if(!updatedObject.value)
                        updatedObject.value = []

                    updatedObject.value = newValue.map((n : any)=>n.value)
                }

                updatedObjects[index] = updatedObject;
                return updatedObjects
            })

            console.log("objeto", object)

        }

        function createOption(inputValue : string){
            if(!object.onCreate)
                return
            object.onCreate(inputValue)
            .then((options : any)=>{
                setOptionsList(options??optionsList)

                // select created value in options preserving selected values
                for(const option of options) {
                    const label = option?.label;
                    if (typeof label !== "string") continue;

                    if(stringEqualsIgnoreCase(label, inputValue)) {
                        handleSelectChange(index, object.type === FormInputs.SELECT_MULTI ? [...values, option] : option)
                        break
                    }
                }
            })
        }

        function getDefaultValueMulti<T>(object : FormObjectSelectMulti<T>, optionsList : typeof object.options){
            if(!Array.isArray(object.value) || optionsList === undefined){
                console.log("primeiro return")
                return undefined;
            }

            let defaultOptionsArr : {value : any, label: string}[]= []
                
            for(const option of optionsList){
                if(object.value.includes(option.value))
                    defaultOptionsArr.push(option)
            }
            console.log("A", defaultOptionsArr)
            return defaultOptionsArr
            // return Array.isArray(object.value)?
            //     optionsList?.filter((option)=>
            //         object.value?.includes(option.value)
            //     ).map((item)=> ({value: item.value, label: item.label}))
            // :
            //     undefined
        }
        function getDefaultValueSingle<T>(object : FormObjectSelectSingle<T>, optionsList : typeof object.options){
            if(!optionsList || !object.value)
                return undefined;
            for(const option of optionsList){
                console.log("Testando opção", option, "Com object.value: ", object.value)

                if(object.value === option.value){
                    console.log("retornando: ", option)
                    return option
                }
            }
            return undefined
        }
        

        console.log("A", values)

        return(
            <div>
                <legend>{object.label}</legend>
                {
                    object.canCreate != undefined && object.canCreate ? 
                        <CreatableSelect isClearable placeholder={`Selecionar ${object.label}`} className="category-select" isMulti={object.type === FormInputs.SELECT_MULTI ? true : undefined} options={optionsList}
                        menuPosition="fixed"
                        onChange={(value) => handleSelectChange(index, value)}
                        noOptionsMessage={()=>`Não foi possível encontrar ${object.label}`}
                        formatCreateLabel={(value) => `Criar "${value}"`}
                        classNamePrefix="category-item"
                        styles={object.stylesConfig}
                        required={object.required}
                        onCreateOption={createOption}
                        value={
                                values   
                        }
                    />
                    :
                        <Select isClearable placeholder={`Selecionar ${object.label}`} className="category-select" isMulti={object.type === FormInputs.SELECT_MULTI ? true : undefined} options={optionsList}
                        menuPosition="fixed"
                        onChange={(value) => handleSelectChange(index, value)}
                        noOptionsMessage={()=>`Não foi possível encontrar ${object.label}`}
                        classNamePrefix="category-item"
                        styles={object.stylesConfig}
                        value={
                                values
                        }
                        required={object.required}
                        />
                }

            </div>
        )
    }

    function getNumberInput(object : FormObjectNumber, index : number){
        return(
            <>
                <legend>{object.label}</legend>
                <input max={object.maxValue} type="number" value={object.value} className="field-input" onChange={(e) => {handleNumberChange(index, e.target.value)}} required={object.required}/>
            </>
        )
    }

    function getDateInput(object : FormObjectDate, index : number){
        return(
            <>
                <legend>{object.label}</legend>
                <input type="date" value={object.value} className="field-input" onChange={(e) => {handleChange(index, e.target.value)}} required={object.required}/>
            </>
        )
    }

    function handleNumberChange(index : number, newValue : any){

        const obj = objects[index]

        if(!obj || obj.type != FormInputs.NUMBER)
            return

        if(obj.maxValue && newValue > obj.maxValue)
            newValue = obj.maxValue
        if(obj.minValue && newValue < obj.minValue)
            newValue = obj.minValue

        handleChange(index, newValue)

    }

    // lets remove the item from form if it is disabled
    function isFormObjectDisabled(object : FormObject) : boolean{ 
        try {
            return (object.disabled && object.disabled(objects)) ?? false;
        } catch {
            return false;
        }
    }

    function renderObjects() : ReactNode{
        return objects.map((object, index) =>(
            object.type == FormInputs.HIDDEN || isFormObjectDisabled(object) ? <></> : 
            <fieldset key={index}>
                {
                    object.type == FormInputs.TEXT ||
                    object.type == FormInputs.LONG_TEXT ||
                    object.type == FormInputs.FORMATED_TEXT ||
                    object.type == FormInputs.URL ?
                    getTextInput(object, index)
                    : object.type == FormInputs.IMAGE ?
                    getImageInput(object, index)
                    : object.type == FormInputs.BOOLEAN ? 
                    getBooleanInput(object, index)
                    : object.type == FormInputs.SELECT_SINGLE || object.type == FormInputs.SELECT_MULTI?
                    getListInput(object, index)
                    : object.type == FormInputs.NUMBER ?
                    getNumberInput(object, index)
                    : object.type == FormInputs.DATE ?
                    getDateInput(object, index)
                    : object.type == FormInputs.RADIO ?
                    getRadioInput(object, index)
                    : <></>

                }
            </fieldset>
        
        ))
    }

    const convertToDTO = (formObjects: FormObject[]) => {
        return formObjects.reduce((formData, currentObject) => {
            if(!isFormObjectDisabled(currentObject)) {
                formData[currentObject.DTOName] = currentObject.value;
            }
            return formData;
        }, {} as Record<string, any>);
    };

    async function handleCallback() {
        try {
            await props.callback?.();
        } catch {
        }
        setTimeout(() => {
            setIsSubmitting(false);
        }, 1000);
    }

    async function makeRequest() {
        try {
          setIsSubmitting(true);
          await props.requisition(convertToDTO(objects));
        } catch {
        }
        handleCallback();
    }

    function handleCancel(){
        if(props.cancelProps?.confirmCancel == undefined || props.cancelProps.confirmCancel == true)
            cancelPopup()
        else
            handleCallback()

    }

    function cancelPopup(){
            SwalUtils.fireModal({
                title: props.cancelProps?.title  ?? "Deseja cancelar esta ação?",
                text: props.cancelProps?.message ?? "Todos os campos preenchidos serão perdidos.",

                showCancelButton: true,
                cancelButtonText: props.cancelProps?.cancelButtonMessage   ?? "Cancelar",
                confirmButtonText: props.cancelProps?.confirmButtonMessage ?? "Ok",
                confirmButtonColor: props.cancelProps?.confirmButtonColor  ?? "var(--wrong-invalid-color)"
            }).then(response =>{
                if(response.isConfirmed){
                    handleCallback()
                }
            })
    }

    return(        
    <UniversiModal>
        <div id="universi-form-container">
            <div className="universi-form-container fields">

                <div className="header">
                    <img src="/assets/imgs/create-content.png" />
                    <h1 className="title">{ props.formTitle } </h1>
                </div>

                {
                renderObjects()
                }   

                <section className="operation-buttons">
                    <button type="button" className="cancel-button" onClick={handleCancel}>
                        <i className="bi bi-x-circle-fill" />
                        {
                            props.cancelButtonText ?? "Cancelar"
                        }
                    </button>
                    <button type="button" className="submit-button" onClick={makeRequest} disabled={isSubmitting || !canSave} title={canSave ? undefined : "Preencha os dados antes de salvar"}>
                        <i className="bi bi-check-circle-fill" />
                        {
                            props.saveButtonText ?? "Salvar"
                        }
                    </button>
                </section>
            </div>
        </div>
    </UniversiModal>
    )

}
