import { useEffect, useState } from "react";

import { UniversimeApi } from "@/services"
import { FormInputs, UniversiForm } from "@/components/UniversiForm/UniversiForm";

import { AVAILABLE_MATERIAL_TYPES, MATERIAL_TYPES_TEXT } from "@/types/Capacity";
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
                    DTOName: "url", label: "Link do material", type: FormInputs.URL, value: material?.url, required: true
                }, {
                    DTOName: "type", label: "Tipo do material", type: FormInputs.SELECT_SINGLE, 
                    options: AVAILABLE_MATERIAL_TYPES.map(t => ({ label: MATERIAL_TYPES_TEXT[t], value: t })), required: true,
                    value: material?.type ? { value: material.type, label: material.type } : undefined,
                }, {
                    DTOName: "addCategoriesByIds", label: "Categorias", type: FormInputs.SELECT_MULTI, 
                    value: material?.categories.map((t)=>({value: t.id, label: t.name})) ?? [],
                    options: availableOptions, canCreate: true, onCreate: handleCreateOption
                }, {
                    DTOName: "id", label: "", type: FormInputs.HIDDEN, value: material?.id
                }
            ]}  requisition={ (data: ManageMaterialForm ) => {
                const body = {
                    categoriesIds: data.addCategoriesByIds,
                    description: data.description,
                    rating: 1 as const,
                    title: data.title,
                    type: data.type,
                    url: data.url,
                };

                if ( isNewMaterial )
                    return UniversimeApi.Capacity.Content.create( {
                        ...body,
                        folders: content ? [ content.id ] : undefined,
                    } );

                else
                    return UniversimeApi.Capacity.Content.update( material.id, body );
            } }
                callback={() => { props.afterSave?.(); }}
    />

    async function handleCreateOption(value: string){
        const createResponse = await UniversimeApi.Capacity.Category.create({ name: value });
        if (!createResponse.isSuccess()) return [];

        const response = await updateCategories();
        if (!response.isSuccess()) return [];

        return response.data.map(t => ({ value: t.id, label: t.name }));
    }

    async function updateCategories() {
        const res = await UniversimeApi.Capacity.Category.list();
        if (res.isSuccess()) setAvailableCategories(res.data);

        return res;
    }
}

type ManageMaterialForm = {
    title: string;
    description?: string;
    url: string;
    type: Capacity.Content.Type;
    addCategoriesByIds: string[];
    addFoldersByIds: string[];
    id?: string;
};
