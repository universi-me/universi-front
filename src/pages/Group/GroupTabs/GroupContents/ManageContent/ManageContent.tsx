import { ChangeEvent, useContext, useEffect, useState } from "react";
import  { CSSObjectWithLabel, GroupBase, StylesConfig } from 'react-select';

import UniversimeApi from "@/services/UniversimeApi";
import { GroupContext } from "@/pages/Group/GroupContext";
import { arrayBufferToBase64 } from "@/utils/fileUtils";

import type { FolderCreate_ResponseDTO, FolderEdit_ResponseDTO } from "@/services/UniversimeApi/Capacity";
import type { Category } from "@/types/Capacity";
import "./ManageContent.less";
import { FormInputs, UniversiForm } from "@/components/UniversiForm/UniversiForm";


const DEFAULT_IMAGE_PATH = "/assets/imgs/default-content.png";

export function ManageContent() {
    const context = useContext(GroupContext);

    const [name, setName] = useState<string>(context?.editContent?.name ?? "");
    const [categoriesIds, setCategoriesIds] = useState<string[]>((context?.editContent?.categories ?? []).map(c => c.id));
    const [description, setDescription] = useState<string>(context?.editContent?.description ?? "");
    const [imageBuffer, setImageBuffer] = useState<ArrayBuffer | undefined>();

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
        if (context?.editContent === undefined)
            return;

        setName(context.editContent?.name ?? "");
        setDescription(context.editContent?.description ?? "");
        setCategoriesIds((context.editContent?.categories ?? []).map(c => c.id));
        setImageBuffer(undefined);
    }, [context?.editContent])

    // prevent later checks
    if (!context)
        return null;

    if (context.editContent === undefined)
        return null;

    const imageRender = imageBuffer
        ? "data:image/jpeg;base64," + arrayBufferToBase64(imageBuffer)
        : context.editContent?.image
            ? context.editContent.image.startsWith("/")
                ? import.meta.env.VITE_UNIVERSIME_API + context.editContent.image
                : context.editContent.image
            : DEFAULT_IMAGE_PATH;

    const canSave = (name.length > 0) && (description.length > 0);
    const isNewContent = context.editContent === null;

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

    return<UniversiForm
        formTitle={context.editContent == null ? "Criar conteúdo" : "Editar conteúdo"}
        objects={[
            {
                DTOName: "name", label: "Nome do conteúdo", type: FormInputs.TEXT, value: context.editContent?.name, required: true, charLimit: 100,
            }, {
                DTOName: "description", label: "Descrição do conteúdo", type: FormInputs.LONG_TEXT, value: context.editContent?.description ?? undefined, required: true, charLimit: 200,
            }, {
                DTOName: "image", label: "Imagem do conteúdo", type: FormInputs.IMAGE, value: undefined, required: false,
                defaultImageUrl: context.editContent?.image
                    ? context.editContent.image.startsWith("/")
                        ? import.meta.env.VITE_UNIVERSIME_API + context.editContent.image
                        : context.editContent.image
                    : undefined,
            }, {
                DTOName: "rating", label: "Rating do conteúdo", type: FormInputs.HIDDEN, value: context.editContent ?  context.editContent?.rating : 1,
            }, {
                DTOName: "addCategoriesByIds", label: "Categorias do conteúdo", type: FormInputs.SELECT_MULTI,
                value: context.editContent?.categories.map(t => ({ label: t.name, value: t.id })) ?? [],
                options: availableCategories.map(c => ({ label: c.name, value: c.id })),
                canCreate: true, required: false, onCreate: handleCreateOption,
            }, {
                DTOName: "groupId", label: "Id do grupo", type: FormInputs.HIDDEN, value: context.group.id,
            }, {
                DTOName: "id", label: "Id do conteúdo", type: FormInputs.HIDDEN, value: context.editContent?.id,
            },
        ]}
        requisition = {context.editContent ? UniversimeApi.Capacity.editFolder : UniversimeApi.Capacity.createFolder}
        callback={()=>{context.setEditContent(undefined); context.refreshData()}}
        />

    async function handleSaveContent() {
        if (!context || context.editContent === undefined)
            return;

        const imageFile = (document.getElementById("file-input") as HTMLInputElement).files?.item(0);

        let imageUrl: string | undefined = undefined;
        if (imageFile) {
            const res = await UniversimeApi.Image.upload({ image: imageFile})
            if (res.success && res.body) {
                imageUrl = res.body.link;
            }
        }

        let request: Promise<FolderCreate_ResponseDTO | FolderEdit_ResponseDTO> = undefined!;
        if (context.editContent === null) {
            request = UniversimeApi.Capacity.createFolder({
                name,
                addCategoriesByIds: categoriesIds,
                description,
                rating: 5,
                groupId: context.group.id,
                image: imageUrl,
            });
        }

        else {
            const addCategories = categoriesIds
                .filter(c => undefined === context.editContent!.categories.find(check => c === check.id));
            const removeCategories = context.editContent.categories
                .filter(c => undefined === categoriesIds.find(check => c.id === check))
                .map(c => c.id);

            request = UniversimeApi.Capacity.editFolder({
                id: context.editContent.id,
                name,
                description,
                addCategoriesByIds: addCategories,
                removeCategoriesByIds: removeCategories,
                rating: 5,
                image: imageUrl,
            });
        }

        request.then(res => {
            if (res.success) {
                context.refreshData();
            }
        })
    }

    function changeImage(e: ChangeEvent<HTMLInputElement>) {
        const imageFile = e.currentTarget.files?.item(0);
        if (!imageFile) {
            setImageBuffer(undefined);
            return;
        }

        const reader = new FileReader();
        reader.onloadend = renderLoadedImage;
        reader.readAsArrayBuffer(imageFile);

        function renderLoadedImage(this: FileReader, ev: ProgressEvent<FileReader>) {
            if (ev.target?.readyState === FileReader.DONE && ev.target.result) {
                setImageBuffer(ev.target.result as ArrayBuffer);
            }
        }
    }
}

export const CATEGORY_SELECT_STYLES: StylesConfig<Category, true, GroupBase<Category>> = {
    control: (styles, { isFocused }) => ({
        ...styles,
        borderRadius: ".625rem",
        outline: isFocused ? "solid 2px var(--primary-color)" : "none",
    }),

    option: (styles, { isFocused }) => {
        const styling: CSSObjectWithLabel = {
            ...styles,
        };

        if (isFocused) {
            styling.backgroundColor = "var(--primary-color)";
            styling.fontWeight = "var(--font-weight-bold)";
            styling.color = "var(--font-color-v1)";
        }

        return styling;
    },

    multiValue: (styles) => ({
        ...styles,
        padding: ".25em",
        backgroundColor: "var(--primary-color)",
        color: "var(--font-color-v1)",
    }),

    multiValueLabel: (styles) => ({
        ...styles,
        color: "var(--font-color-v1)",
    })
};
