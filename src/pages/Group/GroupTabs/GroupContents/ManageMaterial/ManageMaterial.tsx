import { useContext, useEffect, useState } from "react";

import { GroupContext } from "@/pages/Group";
import UniversimeApi from "@/services/UniversimeApi";

import type { Category, ContentType } from "@/types/Capacity";
import "./ManageMaterial.less";
import { FormInputs, UniversiForm } from "@/components/UniversiForm/UniversiForm";

export type ManageMaterialProps = {
    refreshMaterials: () => any;
}

const MAX_TITLE_LENGTH = 50;
const MAX_DESC_LENGTH = 150;
const MAX_URL_LENGTH = 100;

export function ManageMaterial(props: Readonly<ManageMaterialProps>) {
    const context = useContext(GroupContext);

    const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
    const fetchData = ()=>{
        UniversimeApi.Capacity.categoryList()
            .then(response => {
                if (response.success && response.body) {
                    setAvailableCategories(response.body.categories);
                }
            })
    };

    useEffect(()=>{
        fetchData()
    }, [])


    // prevent later checks
    if (!context)
        return null;

    if (context.editMaterial === undefined)
        return null;

    function handleCreateOption(value:any){
        return UniversimeApi.Capacity.createCategory({name: value, image: ""})
        .then(createResponse =>{
            if(createResponse.success){
                return UniversimeApi.Capacity.categoryList()
                .then(response =>{
                    if (response.success && response.body) {
                        setAvailableCategories(response.body.categories);

                        const options = response.body.categories.map(t => ({ value: t.id, label: t.name }));
                        return options;
                    }
                })
            }
        }) 
    }

    return <UniversiForm 

            formTitle={context.editMaterial == null ? "Criar material" : "Editar material"}
            objects={[
                {
                    DTOName: "title", label: "Nome do material", type: FormInputs.TEXT, value: context.editMaterial?.title, required: true
                }, {
                    DTOName: "description", label: "Descrição do material", type: FormInputs.TEXT, value: context.editMaterial?.description ?? "", required: false,
                }, {
                    DTOName: "rating", label: "Rating do material", type: FormInputs.HIDDEN, value: context.editMaterial ? context.editMaterial?.rating : 1
                }, {
                    DTOName: "url", label: "Link do material", type: FormInputs.URL, value: context.editMaterial?.url, required: true
                }, {
                    DTOName: "type", label: "Tipo do material", type: FormInputs.SELECT_SINGLE, 
                    options: AVAILABLE_MATERIAL_TYPES.map(t => ({value: t, label: t})), required: false, 
                    value: context.editMaterial?.type ? { value: context.editMaterial.type, label: context.editMaterial.type } : undefined,
                }, {
                    DTOName: "addCategoriesByIds", label: "Categorias", type: FormInputs.SELECT_MULTI, 
                    value: context.editMaterial?.categories.map((t)=>({value: t.id, label: t.name})) ?? [],  
                    options: availableCategories.map(t => ({value: t.id, label: t.name})), canCreate: true, onCreate: handleCreateOption
                }, {
                    DTOName: "addFoldersByIds", label: "", type: FormInputs.HIDDEN, value: context.editMaterial ? context.editMaterial?.folders.map(t=>(t.id)) : context.currentContent?.id
                }, {
                    DTOName: "id", label: "", type: FormInputs.HIDDEN, value: context.editMaterial?.id
                }
            ]}  requisition={context.editMaterial ? UniversimeApi.Capacity.editContent : UniversimeApi.Capacity.createContent}
                callback={() => {context.setEditMaterial(undefined);  props.refreshMaterials()}}
            ></UniversiForm>

}

function getContentTypeIcon(type: ContentType) {
    return type === "FILE" || type === "FOLDER" ? "file"
        : type === "LINK" ? "link"
        : type === "VIDEO" ? "video"
        : "link";
}


const AVAILABLE_MATERIAL_TYPES: string[] = [
    "LINK",
    "VIDEO",
    "FILE",
];
