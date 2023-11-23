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
    useEffect(()=>{
        UniversimeApi.Capacity.categoryList()
            .then(response => {
                if (response.success && response.body) {
                    setAvailableCategories(response.body.categories);
                }
            })
    }, []);


    // prevent later checks
    if (!context)
        return null;

    if (context.editMaterial === undefined)
        return null;


    return <UniversiForm 
            formTitle={context.editMaterial == null ? "Criar material" : "Editar material"}
            objects={[
                {DTOName: "title", label: "Nome do material", type: FormInputs.TEXT, value: context.editMaterial?.title, required: true},
                {DTOName: "description", label: "Descrição do material", type: FormInputs.LONG_TEXT, value: context.editMaterial?.description, required: true},
                {DTOName: "rating", label: "Rating do material", type: FormInputs.NUMBER, value: context.editMaterial?.rating},
                {DTOName: "url", label: "Link do material", type: FormInputs.URL, value: context.editMaterial?.url, required: true},
                {DTOName: "type", label: "Tipo do material", type: FormInputs.LIST, value : context.editMaterial?.type, listObjects: AVAILABLE_MATERIAL_TYPES.map(([t] : [ContentType, string])=>({value: t, label: t}))},
                {DTOName: "addCategoriesByIds", label: "Categorias", type: FormInputs.LIST, value: context.editMaterial?.categories.map((t)=>(t.id)),  listObjects: availableCategories.map(t => ({value: t.id, label: t.name})), isListMulti: true},
                {DTOName: "addFoldersByIds", label: "", type: FormInputs.NONE, value: context.editMaterial ? context.editMaterial?.folders.map(t=>(t.id)) : context.currentContent?.id},
                {DTOName: "id", label: "", type: FormInputs.NONE, value: context.editMaterial?.id}
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


const AVAILABLE_MATERIAL_TYPES: [ContentType, string][] = [
    ["LINK", "Link"],
    ["VIDEO", "Vídeo"],
    ["FILE", "Arquivo"],
];
