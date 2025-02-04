import { useContext, useEffect, useState } from "react";

import { UniversimeApi } from "@/services"
import { FormInputs, UniversiForm } from "@/components/UniversiForm/UniversiForm";

import { contentImageUrl } from "@/utils/apiUtils";
import { IMG_DEFAULT_CONTENT } from "@/utils/assets";

import type { Category, Folder } from "@/types/Capacity";
import type { Group } from "@/types/Group";

import "./ManageContent.less";
import { GroupContext } from "@/pages/Group";
import { FolderCreate_RequestDTO } from "@/services/UniversimeApi/Capacity";
import { CompetenceType } from "@/types/Competence";

export type ManageContentProps = {
    /** A null `content` means a content is being created, while a value means
     * an existing content is being edited.
     */
    content: Folder | null;

    /** The default group the content should be added to */
    group?: Group;

    /** A callback to be called after the content is saved */
    afterSave?: () => any;
};

export function ManageContent(props: Readonly<ManageContentProps>) {
    const [content, setContent] = useState(props.content);
    const [group, setGroup] = useState(props.group);

    const [availableCategories, setAvailableCategories] = useState<Category[]>();
    const [availableCompetenceTypes, setAvailableCompetenceTypes] = useState<CompetenceType[]>();

    const groupContext = useContext(GroupContext)

    useEffect(() => {
        setContent(props.content);
        setGroup(props.group);

        updateCategories();
        updateCompetenceTypes();
    }, [props]);

    if (availableCategories === undefined || availableCompetenceTypes === undefined)
        return null;

    const isNewContent = content === null;
    const availableCategoriesOptions = availableCategories.map(c => ({ label: c.name, value: c.id }));
    const availableCompetenceTypeOptions = availableCompetenceTypes.map(c => ({ label: c.name, value: c.id }));

    return <UniversiForm
        formTitle = { isNewContent ? "Criar conteúdo" : "Editar conteúdo" }
        objects = {[
            {
                DTOName: "name", label: "Nome do conteúdo", type: FormInputs.TEXT, value: content?.name, required: true, charLimit: 100, 
            }, {
                DTOName: "description", label: "Descrição do conteúdo", type: FormInputs.LONG_TEXT, value: content?.description ?? undefined, required: false, charLimit: 200,
            }, {
                DTOName: "image", label: "Imagem do conteúdo", type: FormInputs.IMAGE, value: undefined, required: false,
                defaultImageUrl: content?.image
                    ? contentImageUrl(content)
                    : IMG_DEFAULT_CONTENT,
            }, {
                DTOName: "rating", label: "Rating do conteúdo", type: FormInputs.HIDDEN, value: content ?  content?.rating : 1,
            }, {
                DTOName: "addCategoriesByIds", label: "Categorias do conteúdo", type: FormInputs.SELECT_MULTI,
                value: content?.categories.map(t => ({ label: t.name, value: t.id })) ?? [],
                options: availableCategoriesOptions,
                canCreate: true, required: false, onCreate: handleCreateCategory,
            }, {
                DTOName: "addCompetenceTypeBadgeIds", label: "Selos de Competência", type: FormInputs.SELECT_MULTI,
                value: content?.grantsBadgeToCompetences.map(ct => ({ label: ct.name, value: ct.id })) ?? [],
                options: availableCompetenceTypeOptions,
                canCreate: true, required: false, onCreate: handleCreateCompetenceType
            }, {
                DTOName: "groupId", label: "Id do grupo", type: FormInputs.HIDDEN, value: group?.id,
            }, {
                DTOName: "id", label: "Id do conteúdo", type: FormInputs.HIDDEN, value: content?.id,
            }, {
                DTOName: "groupPath", label: "Path do grupo", type: FormInputs.HIDDEN, value: group?.path
            }
        ]}
        requisition = { !isNewContent ? UniversimeApi.Capacity.editFolder : handleCreateNewContent }
        callback = {() => { props.afterSave?.();}}
    />;

    
    function handleCreateNewContent(dto : FolderCreate_RequestDTO){

        if(groupContext == undefined || group == undefined)
            return;

        const canPost = (
        (groupContext.group.everyoneCanPost) ||
        (!groupContext.group.everyoneCanPost && groupContext.group.admin.id == groupContext.loggedData.profile.id)
        )

        UniversimeApi.Capacity.createFolder(dto)
            .then(()=>{groupContext.refreshData()})

    }

    async function handleCreateCategory(value: string){
        const createResponse = await UniversimeApi.Capacity.createCategory({ name: value, image: "" });
        if (!createResponse.success) return [];

        const response = await updateCategories();
        if (!response.success) return [];

        return response.body.categories.map(t => ({ value: t.id, label: t.name }));
    }

    async function handleCreateCompetenceType(value: string){
        const createResponse = await UniversimeApi.CompetenceType.create({ name: value });
        if (!createResponse.success) return [];

        const response = await updateCompetenceTypes();
        if (!response.success) return [];

        return response.body.list.map(t => ({ value: t.id, label: t.name }));
    }

    async function updateCategories() {
        const res = await UniversimeApi.Capacity.categoryList();
        if (res.success) setAvailableCategories(res.body.categories);

        return res;
    }

    async function updateCompetenceTypes() {
        const res = await UniversimeApi.CompetenceType.list();
        if (res.success)
            setAvailableCompetenceTypes(res.body.list);

        return res;
    }
}
