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
    // const [contentsIds, setContentsIds] = useState<string[]>((context?.editMaterial?.folders ?? []).map(c => c.id));
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
        // setContentsIds((context?.editMaterial?.folders ?? []).map(c => c.id));
        setCategoriesIds((context?.editMaterial?.categories ?? []).map(c => c.id));
    }, [context?.editMaterial]);

    // prevent later checks
    if (!context)
        return null;

    if (context.editMaterial === undefined)
        return null;

    const canSave = (title.length > 0) && (description.length > 0) && (url.length > 0);
    const isNewMaterial = context.editMaterial === null;

    const contentTypeIcon = getContentTypeIcon(type);

    const MATERIAL_TYPE_OPTIONS: [OptionInMenu<ContentType>, ContentType][] = AVAILABLE_MATERIAL_TYPES
        .map(t => {
            return [{
                text: getContentTypeOptionText(t[0], t[1]),
                className: "type-dropdown-option",
                onSelect(data){ setType(data); },
            }, t[0]]
        });


    return <UniversiModal>
        <div id="manage-material">

            <div className="header">
                <img src="/assets/imgs/create-content.png" />
                <h1 className="title">{ isNewMaterial ? "Criar" : "Editar" } material</h1>
            </div>

            <div className="manage-material fields">
                <fieldset>
                    <legend>
                        Título do Material
                        <div className="char-counter">
                            {title.length} / {MAX_TITLE_LENGTH}
                        </div>
                    </legend>
                    <input className="field-input" type="text" defaultValue={context.editMaterial?.title} onChange={setStateAsValue(setTitle)} maxLength={MAX_TITLE_LENGTH}/>
                </fieldset>

                <fieldset>
                    <legend>
                        Descrição
                        <div className="char-counter">
                            {description.length} / {MAX_DESC_LENGTH}
                        </div>
                    </legend>
                    <textarea className="field-input" defaultValue={context.editMaterial?.description ?? undefined} onChange={setStateAsValue(setDescription)} maxLength={MAX_DESC_LENGTH} />
                </fieldset>

                <section className="url-wrapper">
                    <fieldset className="type-fieldset">
                        <legend>Tipo</legend>
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger asChild>
                                <img className="material-type-trigger" src={`/assets/imgs/${contentTypeIcon}.png`} />
                            </DropdownMenu.Trigger>

                            <DropdownMenu.Content className="type-dropdown-menu" side="top">
                                { MATERIAL_TYPE_OPTIONS.map(([def, data]) => renderOption(data, def)) }
                            </DropdownMenu.Content>
                        </DropdownMenu.Root>
                    </fieldset>

                    <fieldset className="url-fieldset">
                        <legend>
                            Link de acesso
                            <div className="char-counter">{url.length}/{MAX_URL_LENGTH}</div>
                        </legend>
                        <input className="field-input" type="url" defaultValue={context.editMaterial?.url} onChange={setStateAsValue(setUrl)} maxLength={MAX_URL_LENGTH} />
                    </fieldset>
                </section>

                <fieldset>
                    <legend>Categorias</legend>
                    <Select placeholder="Selecionar categorias..." className="category-select" isMulti options={availableCategories}
                        onChange={(value) => {setCategoriesIds(value.map(v => v.id))}}
                        defaultValue={ availableCategories.filter(c => context.editMaterial?.categories.map(c => c.id).includes(c.id)) } noOptionsMessage={()=>"Categoria Não Encontrada"}
                        getOptionLabel={c => c.name} getOptionValue={c => c.id} classNamePrefix="category-item" styles={CATEGORY_SELECT_STYLES}
                    />
                </fieldset>


                <section className="operation-buttons">
                    <button type="button" className="cancel-button" onClick={() => {context.setEditMaterial(undefined)}}>Cancelar</button>
                    <button type="button" className="submit-button" onClick={handleSaveMaterial} disabled={!canSave} title={canSave ? undefined : "Preencha os dados antes de salvar"}>
                        <i className="bi bi-check-circle-fill" />
                        { isNewMaterial ? "Criar" : "Salvar" }
                    </button>
                </section>
            </div>
        </div>
    </UniversiModal>

    function handleSaveMaterial() {
        if (!context || context.editMaterial === undefined)
            return;

        if (context.editMaterial === null) {
            UniversimeApi.Capacity.createContent({
                title, description, url, type, addCategoriesByIds: categoriesIds, addFoldersByIds: context.currentContent?.id, rating: 5,
                // todo: image upload
            }).then(afterSave);
        }

        else {
            const addCategoriesByIds = categoriesIds
                .filter(c => undefined === context.editMaterial!.categories.find(check => c === check.id));
            const removeCategoriesByIds = context.editMaterial.categories
                .filter(c => undefined === categoriesIds.find(check => c.id === check))
                .map(c => c.id);

            UniversimeApi.Capacity.editContent({
                id: context.editMaterial.id, title, description, url, type, addCategoriesByIds, removeCategoriesByIds
                // todo: image upload
                // todo: verify if editing contents will be a thing
            }).then(afterSave);
        }

        function afterSave(response: ContentCreate_ResponseDTO | ContentEdit_ResponseDTO) {
            context!.setEditMaterial(undefined);
            props.refreshMaterials();
        }
    }
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
