import { useContext, useEffect, useState } from "react";
import Select from 'react-select';
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { CATEGORY_SELECT_STYLES, GroupContext } from "@/pages/Group";
import UniversimeApi from "@/services/UniversimeApi";
import { UniversiModal } from "@/components/UniversiModal";
import { setStateAsValue } from "@/utils/tsxUtils";
import { type OptionInMenu, renderOption } from "@/utils/dropdownMenuUtils";

import type { ContentCreate_ResponseDTO, ContentEdit_ResponseDTO } from "@/services/UniversimeApi/Capacity";
import type { Category, ContentType } from "@/types/Capacity";
import "./ManageMaterial.less";
import { FormInputs, UniversiForm } from "@/components/UniversiForm/UniversiForm";
import { TextValidation } from "@/components/UniversiForm/Validation/TextValidation";

export type ManageMaterialProps = {
    refreshMaterials: () => any;
}

const MAX_TITLE_LENGTH = 50;
const MAX_DESC_LENGTH = 150;
const MAX_URL_LENGTH = 100;

export function ManageMaterial(props: Readonly<ManageMaterialProps>) {
    const context = useContext(GroupContext);

    const [title, setTitle] = useState<string>(context?.editMaterial?.title ?? "");
    const [description, setDescription] = useState<string>(context?.editMaterial?.description ?? "");
    const [url, setUrl] = useState<string>(context?.editMaterial?.url ?? "");
    const [type, setType] = useState<ContentType>(context?.editMaterial?.type ?? "LINK");
    const [rating, setRating] = useState<number>(context?.editMaterial?.rating ?? 0);
    const [contentsIds, setContentsIds] = useState<string[]>((context?.editMaterial?.folders ?? []).map(c => c.id));
    const [categoriesIds, setCategoriesIds] = useState<string[]>((context?.editMaterial?.categories ?? []).map(c => c.id));

    const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
    useEffect(()=>{
        UniversimeApi.Capacity.categoryList()
            .then(response => {
                if (response.success && response.body) {
                    setAvailableCategories(response.body.categories);
                }
            })
    }, []);

    useEffect(() => {
        if (context?.editMaterial === undefined)
            return;

        setTitle(context?.editMaterial?.title ?? "");
        setDescription(context?.editMaterial?.description ?? "");
        setUrl(context?.editMaterial?.url ?? "");
        setType(context?.editMaterial?.type ?? "LINK");
        setContentsIds((context?.editMaterial?.folders ?? []).map(c => c.id));
        setCategoriesIds((context?.editMaterial?.categories ?? []).map(c => c.id));
    }, [context?.editMaterial]);

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
                {DTOName: "type", label: "Tipo do material", type: FormInputs.LIST, value : {value: context.editMaterial?.type, label: context.editMaterial?.type}, listObjects: AVAILABLE_MATERIAL_TYPES.map(([t] : [ContentType, string])=>({value: t, label: t}))},
                {DTOName: "addCategoriesByIds", label: "Categorias", type: FormInputs.LIST, value: context.editMaterial?.categories.map((t)=>({label: t.name, value: t.id})), listObjects: availableCategories.map(t => ({value: t.id, label: t.name})), isListMulti: true},
                {DTOName: "addFoldersByIds", label: "", type: FormInputs.NONE, value: context.editMaterial ? context.editMaterial?.folders.map(t=>(t.id)) : context.currentContent?.id},
                {DTOName: "id", label: "", type: FormInputs.NONE, value: context.editMaterial?.id}
            ]}  requisition={context.editMaterial ? UniversimeApi.Capacity.editContent : UniversimeApi.Capacity.createContent}
                callback={() => {context.setEditMaterial(undefined); props.refreshMaterials()}}
            ></UniversiForm>

}

function getContentTypeIcon(type: ContentType) {
    return type === "FILE" || type === "FOLDER" ? "file"
        : type === "LINK" ? "link"
        : type === "VIDEO" ? "video"
        : "link";
}

function getContentTypeOptionText(type: ContentType, title: string) {
    return <img
        className="material-type-icon"
        src={`/assets/imgs/${getContentTypeIcon(type)}.png`}
        title={title}
    />
}

const AVAILABLE_MATERIAL_TYPES: [ContentType, string][] = [
    ["LINK", "Link"],
    ["VIDEO", "Vídeo"],
    ["FILE", "Arquivo"],
];
