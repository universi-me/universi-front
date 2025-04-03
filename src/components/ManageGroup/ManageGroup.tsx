import { FormInputs, TextValidation, UniversiForm, ValidationComposite } from "@/components/UniversiForm";
import { UniversimeApi } from "@/services"

import { groupBannerUrl, groupHeaderUrl, groupImageUrl } from "@/utils/apiUtils";
import { GroupTypeToLabel } from "@/types/Group";

export type ManageGroupProps = {
    group: Group | null;
    parentGroup: Group;

    callback: () => any;
};

export function ManageGroup(props: Readonly<ManageGroupProps>) {
    const { group, parentGroup, callback } = props;
    const isCreating = group === null;
    const isOrganization = group?.rootGroup ?? false;

    const formTitle = isCreating ? "Criar Grupo" : isOrganization ? "Editar Organização" : "Editar Grupo";
    const requisition = isCreating ? UniversimeApi.Group.create : UniversimeApi.Group.update;

    return <UniversiForm formTitle={ formTitle }
        objects={[
            {
                DTOName: "nickname", label: isOrganization ? "Apelido da Organização" : "Apelido do Grupo",
                type: isCreating ? FormInputs.TEXT : FormInputs.HIDDEN,
                value: undefined,
                required: isCreating,
                validation: isCreating ? new ValidationComposite<string>().addValidation(new TextValidation()) : undefined
            }, {
                DTOName: "name", label: isOrganization ? "Nome da Organização" : "Nome do Grupo",
                type: FormInputs.TEXT,
                value: group?.name,
                required: true, 
                validation: new ValidationComposite<string>().addValidation(new TextValidation())
            }, {
                DTOName: "description", label: isOrganization ? "Descrição da Organização" : "Descrição do Grupo",
                type: FormInputs.LONG_TEXT,
                value: group?.description,
                required: true,
                charLimit: 200,
                validation: new ValidationComposite<string>().addValidation(new TextValidation())
            }, {
                DTOName: "image", label: isOrganization ? "Imagem da Organização" : "Imagem do Grupo",
                type: FormInputs.IMAGE,
                value:undefined, 
                defaultImageUrl: group ? groupImageUrl(group) : undefined,
                crop: true,
                aspectRatio: 1,
                required: false
            }, {
                DTOName: "bannerImage", label: isOrganization ? "Banner da Organização" : "Banner do Grupo",
                type: FormInputs.IMAGE,
                value:undefined, 
                defaultImageUrl: group ? groupBannerUrl(group) : undefined,
                crop: true,
                aspectRatio: 2.5,
                required: false
            }, {
                DTOName: "headerImage", label: "Logo da Organização",
                type: isOrganization ? FormInputs.IMAGE : FormInputs.HIDDEN,
                value:undefined,
                defaultImageUrl: group ? groupHeaderUrl(group) : undefined,
                crop: true,
                isPublic: isOrganization,
                required: false
            }, {
                DTOName: "groupType", label: isOrganization ? "Tipo da Organização" : "Tipo do Grupo",
                type: FormInputs.SELECT_SINGLE,
                value: group ? { value : group.type, label : group.type } : undefined,
                options: OPTIONS_GROUP_TYPES,
                required: true
            }, {
                DTOName: "canHaveSubgroup", label: "Permitir Criação de Subgrupos",
                type: FormInputs.BOOLEAN,
                value: group?.canCreateGroup
            }, {
                DTOName: "isPublic", label: "Grupo Público",
                type: FormInputs.BOOLEAN,
                value: group?.publicGroup ?? true
            }, {
                DTOName: "canJoin", label: "Permitir Entradas de Usuários",
                type: FormInputs.BOOLEAN,
                value: group?.canEnter
            }, {
                DTOName: "isRootGroup", label: "Grupo raiz",
                type: FormInputs.HIDDEN,
                value: group?.rootGroup ?? false
            }, {
                DTOName: "parentGroupId", label: "Id do grupo pai (grupo atual)",
                type: FormInputs.HIDDEN,
                value: parentGroup.id
            }, {
                DTOName: "everyoneCanPost", label: "Permitir Publicações para Todos os Usuários",
                type: FormInputs.BOOLEAN,
                value: group?.everyoneCanPost
            }, {
                DTOName: "groupPath", label: "path",
                type: FormInputs.HIDDEN,
                value: group?.path
            },
        ]}
        requisition={requisition}
        callback={callback}
    />
}

const OPTIONS_GROUP_TYPES = Object.entries(GroupTypeToLabel)
    .sort((a, b) => a[1].localeCompare(b[1]))
    .map((t) => ({ value: t[0] as GroupType, label: t[1] }));
