import { FormInputs, TextValidation, UniversiForm, ValidationComposite } from "@/components/UniversiForm";
import { UniversimeApi } from "@/services"

import { groupBannerUrl, groupHeaderUrl, groupImageUrl } from "@/utils/apiUtils";
import { Group, GroupType, GroupTypeToLabel } from "@/types/Group";

export type ManageGroupProps = {
    group: Group | null;
    parentGroup: Group;

    callback: () => any;
};

export function ManageGroup(props: Readonly<ManageGroupProps>) {
    const { group, parentGroup, callback } = props;
    const isCreating = group === null;

    const formTitle = isCreating ? "Criar grupo" : "Editar grupo";
    const requisition = isCreating ? UniversimeApi.Group.create : UniversimeApi.Group.update;

    return <UniversiForm formTitle={ formTitle }
        objects={[
            {
                DTOName: "nickname", label: "Apelido do grupo",
                type: isCreating ? FormInputs.TEXT : FormInputs.HIDDEN,
                value: undefined,
                required: isCreating,
                validation: isCreating ? new ValidationComposite<string>().addValidation(new TextValidation()) : undefined
            }, {
                DTOName: "name", label: "Nome do grupo",
                type: FormInputs.TEXT,
                value: group?.name,
                required: true, 
                validation: new ValidationComposite<string>().addValidation(new TextValidation())
            }, {
                DTOName: "description", label: "Descrição do grupo",
                type: FormInputs.LONG_TEXT,
                value: group?.description,
                required: true,
                charLimit: 200,
                validation: new ValidationComposite<string>().addValidation(new TextValidation())
            }, {
                DTOName: "imageUrl", label: "Imagem do grupo",
                type: FormInputs.IMAGE,
                value:undefined, 
                defaultImageUrl: group ? groupImageUrl(group) : undefined,
                crop: true,
                aspectRatio: 1,
                required: false
            }, {
                DTOName: "bannerImageUrl", label: "Banner do grupo",
                type: FormInputs.IMAGE,
                value:undefined, 
                defaultImageUrl: group ? groupBannerUrl(group) : undefined,
                crop: true,
                aspectRatio: 2.5,
                required: false
            }, {
                DTOName: "headerImageUrl", label: "Logo da Organização",
                type: group?.rootGroup ? FormInputs.IMAGE : FormInputs.HIDDEN,
                value:undefined,
                defaultImageUrl: group ? groupHeaderUrl(group) : undefined,
                crop: true,
                required: false
            }, {
                DTOName: "groupType", label: "Tipo do grupo",
                type: FormInputs.SELECT_SINGLE,
                value: group ? { value : group.type, label : group.type } : undefined,
                options: OPTIONS_GROUP_TYPES,
                required: true
            }, {
                DTOName: "canHaveSubgroup", label: "Pode criar grupo",
                type: FormInputs.BOOLEAN,
                value: group?.canCreateGroup
            }, {
                DTOName: "isPublic", label: "Grupo público",
                type: FormInputs.BOOLEAN,
                value: group?.publicGroup ?? true
            }, {
                DTOName: "canJoin", label: "Usuários podem entrar",
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
                DTOName: "everyoneCanPost", label: "Todos usuários podem postar",
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
