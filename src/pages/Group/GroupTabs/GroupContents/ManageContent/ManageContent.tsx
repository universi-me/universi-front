import { ChangeEvent, useContext, useEffect, useState } from "react";
import Select, { CSSObjectWithLabel, GroupBase, StylesConfig } from 'react-select';

import UniversimeApi from "@/services/UniversimeApi";
import { UniversiModal } from "@/components/UniversiModal";
import { GroupContext } from "@/pages/Group/GroupContext";
import { setStateAsValue } from "@/utils/tsxUtils";

import type { FolderCreate_ResponseDTO, FolderEdit_ResponseDTO } from "@/services/UniversimeApi/Capacity";
import type { Category } from "@/types/Capacity";
import "./ManageContent.less";

const MAX_NAME_LENGTH = 50;
const MAX_DESC_LENGTH = 200;

export function ManageContent() {
    const context = useContext(GroupContext);

    const [name, setName] = useState<string>(context?.editContent?.name ?? "");
    const [categoriesIds, setCategoriesIds] = useState<string[]>((context?.editContent?.categories ?? []).map(c => c.id));
    const [description, setDescription] = useState<string>(context?.editContent?.description ?? "");
    const [imagem, setImagem] = useState<string | undefined>("");

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
    }, [context?.editContent])

    // prevent later checks
    if (!context)
        return null;

    if (context.editContent === undefined)
        return null;

    const canSave = (name.length > 0) && (description.length > 0) && (imagem != "");
    const isNewContent = context.editContent === null;

    return <UniversiModal>
        <div id="manage-content">

            <div className="header">
                <img src="/assets/imgs/create-content.png"/>
                <h1 className="title">{isNewContent ? "Criar" : "Editar"} conteúdo</h1>
            </div>

            <fieldset>
                <legend>
                    Título do Conteúdo
                    <div className="char-counter" style={name.length >= MAX_NAME_LENGTH-5 ? {color: "red"} : {}}>
                        {name.length} / {MAX_NAME_LENGTH}
                    </div>
                </legend>
                <input className="field-input" type="text" defaultValue={context.editContent?.name} onChange={setStateAsValue(setName)} maxLength={MAX_NAME_LENGTH}/>
            </fieldset>

            <fieldset>
                <legend>
                    Descrição
                    <div className="char-counter" style={description.length >= MAX_DESC_LENGTH-5 ? {color: "red"} : {}}>
                        {description.length} / {MAX_DESC_LENGTH}
                    </div>
                </legend>
                <textarea className="field-input" defaultValue={context.editContent?.description ?? undefined} onChange={setStateAsValue(setDescription)} maxLength={MAX_DESC_LENGTH} />
            </fieldset>

            <div className="multiple-buttons">
                <div className="label-button">
                    <legend>Categorias</legend>
                    <Select placeholder="Selecionar categorias..." className="field-input category-select" isMulti options={availableCategories}
                        onChange={(value) => {setCategoriesIds(value.map(v => v.id))}}
                        defaultValue={ availableCategories.filter(c => context.editContent?.categories.map(c => c.id).includes(c.id)) } noOptionsMessage={()=>"Categoria Não Encontrada"}
                        getOptionLabel={c => c.name} getOptionValue={c => c.id} classNamePrefix="category-item" styles={CATEGORY_SELECT_STYLES}
                    />
                </div>
                <div className="label-button">
                    <legend>Imagem de conteúdo</legend>
                    <input type="file" style={{display: "none"}} id="file-input" accept="image/*" onChange={createImage}/>
                    <div onClick={()=>{document.getElementById("file-input")?.click()}} className="image-button">
                        Selecionar arquivo
                    </div>
                </div>
            </div>


            <section className="operation-buttons">
                <button type="button" className="finish-button cancel-button" onClick={() => {context.setEditContent(undefined)}}><i className="bi bi-x-circle-fill" />Cancelar</button>
                <button type="button" className="finish-button submit-button" onClick={handleSaveContent} disabled={!canSave} title={canSave ? undefined : "Preencha os dados antes de salvar"}>
                    <i className="bi bi-check-circle-fill"></i>
                    { isNewContent ? "Criar" : "Salvar" }
                </button>
            </section>



        </div>
    </UniversiModal>

    async function createImage(e : ChangeEvent<HTMLInputElement>){
        const image = e.currentTarget.files?.item(0);
        if(!image)
            return
        const reader = new FileReader();
        reader.readAsArrayBuffer(image);
        const imageResponse = await UniversimeApi.Image.upload({image:image});
        setImagem(imageResponse.body?.link)
    }


    function handleSaveContent() {
        if (!context || context.editContent === undefined)
            return;

        let request: Promise<FolderCreate_ResponseDTO | FolderEdit_ResponseDTO> = undefined!;
        if (context.editContent === null) {
            request = UniversimeApi.Capacity.createFolder({
                name,
                addCategoriesByIds: categoriesIds,
                description,
                rating: 5,
                groupId: context.group.id,
                image: imagem,
                // todo: image upload
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
                // todo: image upload
            });
        }

        request.then(res => {
            if (res.success) {
                context.refreshData();
            }
        })
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
