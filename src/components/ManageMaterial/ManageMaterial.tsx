import { useEffect, useState } from "react";

import UniversimeApi from "@/services/UniversimeApi";
import { FormInputs, UniversiForm } from "@/components/UniversiForm/UniversiForm";

import { AVAILABLE_MATERIAL_TYPES, MATERIAL_TYPES_TEXT, type Category, type Content, type Folder } from "@/types/Capacity";
import "./ManageMaterial.less";

export type ManageMaterialProps = {
    /** A null `material` means a material is being created, while a value means
     * an existing material is being edited.
     */
    material: Content | null;

    /** The content the material will be added to when being created */
    content?: Folder;

    /** Callback executed after the material is saved */
    afterSave?: () => any;
}

export function ManageMaterial(props: Readonly<ManageMaterialProps>) {
    const [material, setMaterial] = useState(props.material);
    const [content, setContent] = useState(props.content);

    const [availableCategories, setAvailableCategories] = useState<Category[]>();

    useEffect(() => {
        setMaterial(props.material);
        setContent(props.content);

        updateCategories();
    }, [props]);

    if (availableCategories === undefined) return null;

    const isNewMaterial = material === null;
    const availableOptions = availableCategories.map(c => ({ label: c.name, value: c.id }));

    return <UniversiForm
            formTitle={ isNewMaterial ? "Criar material" : "Editar material"}
            objects={[
                {
                    DTOName: "title", label: "Nome do material", type: FormInputs.TEXT, value: material?.title, required: true
                }, {
                    DTOName: "description", label: "Descrição do material", type: FormInputs.LONG_TEXT, value: material?.description ?? "", required: false, charLimit: 200,
                }, {
                    DTOName: "rating", label: "Rating do material", type: FormInputs.HIDDEN, value: material ? material?.rating : 1
                }, {
                    DTOName: "url", label: "Link do material", type: FormInputs.URL, value: material?.url, required: true
                }, {
                    DTOName: "type", label: "Tipo do material", type: FormInputs.SELECT_SINGLE, 
                    options: AVAILABLE_MATERIAL_TYPES.map(t => ({ label: MATERIAL_TYPES_TEXT[t], value: t })), required: false,
                    value: material?.type ? { value: material.type, label: material.type } : undefined,
                }, {
                    DTOName: "addCategoriesByIds", label: "Categorias", type: FormInputs.SELECT_MULTI, 
                    value: material?.categories.map((t)=>({value: t.id, label: t.name})) ?? [],
                    options: availableOptions, canCreate: true, onCreate: handleCreateOption
                }, {
                    DTOName: "addFoldersByIds", label: "", type: FormInputs.HIDDEN, value: material ? material?.folders.map(t=>(t.id)) : content?.id
                }, {
                    DTOName: "id", label: "", type: FormInputs.HIDDEN, value: material?.id
                }
            ]}  requisition={ !isNewMaterial ? UniversimeApi.Capacity.editContent : UniversimeApi.Capacity.createContent}
                callback={() => { props.afterSave?.(); }}
    />

    async function handleCreateOption(value: string){
        const createResponse = await UniversimeApi.Capacity.createCategory({ name: value, image: "" });
        if (!createResponse.success) return [];

        const response = await updateCategories();
        if (!response.success) return [];

        return response.body.categories.map(t => ({ value: t.id, label: t.name }));
    }

    async function updateCategories() {
        const res = await UniversimeApi.Capacity.categoryList();
        if (res.success) setAvailableCategories(res.body.categories);

        return res;
    }
}
