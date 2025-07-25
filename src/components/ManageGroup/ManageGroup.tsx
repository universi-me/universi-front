import UniversiForm from "@/components/UniversiForm";
import { UniversimeApi } from "@/services"

import { GroupTypeSelect } from "@/types/Group";
import { type ApiResponse, groupBannerUrl, groupHeaderUrl, groupImageUrl } from "@/utils/apiUtils";
import { useEffect, useState } from "react";
import LoadingSpinner from "../LoadingSpinner";

export type ManageGroupProps = {
    group: Group | null;
    parentGroup: Group;

    callback?: ( response: Optional<ApiResponse<Group.DTO>> ) => any;
};

export function ManageGroup(props: Readonly<ManageGroupProps>) {
    const { group, parentGroup, callback } = props;

    const isCreating = group === null;
    const isOrganization = group?.rootGroup ?? false;

    const [ availableGroupTypes, setAvailableGroupTypes ] = useState<Group.Type[]>();
    useEffect( () => {
        UniversimeApi.GroupType.list()
        .then( res => {
            if ( res.isSuccess() )
                setAvailableGroupTypes( res.body );
        } )
    }, [] );

    if ( availableGroupTypes === undefined )
        return <LoadingSpinner />

    return <UniversiForm.Root title={ isCreating ? "Criar Grupo" : isOrganization ? "Editar Organização" : "Editar Grupo" } callback={ handleForm }>
        <UniversiForm.Input.Text
            param="nickname"
            label={ isOrganization ? "Apelido da Organização" : "Apelido do Grupo" }
            defaultValue={ group?.nickname }
            disabled={ !isCreating }
            required={ isCreating }
            title={ isCreating ? undefined : "O apelido do grupo não pode ser alterado após criado" }
        />

        <UniversiForm.Input.Text
            param="name"
            label={ isOrganization ? "Nome da Organização" : "Nome do Grupo" }
            defaultValue={ group?.name }
            required
        />

        <UniversiForm.Input.FormattedText
            param="description"
            label={ isOrganization ? "Descrição da Organização" : "Descrição do Grupo" }
            defaultValue={ group?.description }
            required
        />

        <UniversiForm.Input.Image
            param="image"
            label={ isOrganization ? "Imagem da Organização" : "Imagem do Grupo" }
            defaultValue={ groupImageUrl(group!) }
            aspectRatio={ 1 }
        />

        <UniversiForm.Input.Image
            param="bannerImage"
            label={ isOrganization ? "Banner da Organização" : "Banner do Grupo" }
            defaultValue={ groupBannerUrl(group!) }
            aspectRatio={ 2.5 }
        />

        { isOrganization && <UniversiForm.Input.Image
            param="headerImage"
            label="Logo da Organização"
            defaultValue={ groupHeaderUrl(group!) }
        /> }

        <GroupTypeSelect
            param="groupType"
            options={ availableGroupTypes }
            label={ isOrganization ? "Tipo da Organização" : "Tipo do Grupo" }
            defaultValue={ group?.type }
            required
            disabled={ Boolean( group?.activity ) }
            help={ group?.activity && "O tipo de um Grupo de Atividade não pode ser mudado" }
        />

        <UniversiForm.Input.Switch
            param="canCreateSubgroup"
            label="Permitir Criação de Subgrupos"
            defaultValue={ group?.canCreateGroup }
        />

        { !isOrganization && <UniversiForm.Input.Switch
            param="isPublic"
            label="Grupo Público"
            defaultValue={ isOrganization ? true : group?.publicGroup ?? true }
            disabled={ isOrganization }
        /> }

        { !isOrganization && <UniversiForm.Input.Switch
            param="canJoin"
            label="Permitir Entrada de Usuários"
            defaultValue={ group?.canEnter }
        /> }
    </UniversiForm.Root>

    async function handleForm( form: ManageGroupForm ) {
        if ( !form.confirmed )
            return callback?.( undefined );

        const image = form.body.image instanceof File
            ? await UniversimeApi.Image.upload( { isPublic: true, image: form.body.image } )
            : undefined;

        const bannerImage = form.body.bannerImage instanceof File
            ? await UniversimeApi.Image.upload( { isPublic: true, image: form.body.bannerImage } )
            : undefined;

        const headerImage = form.body.headerImage instanceof File
            ? await UniversimeApi.Image.upload( { isPublic: true, image: form.body.headerImage } )
            : undefined;

        const body = {
                name: form.body.name,
                description: form.body.description,
                canCreateSubgroup: form.body.canCreateSubgroup,
                canJoin: form.body.canJoin,
                groupType: form.body.groupType.id,
                isPublic: form.body.isPublic,
                image: image?.body,
                bannerImage: bannerImage?.body,
                headerImage: headerImage?.body,
        };

        const res = isCreating
            ? await UniversimeApi.Group.create( {
                ...body,
                parentGroup: parentGroup.id,
                nickname: form.body.nickname,
            } )
            : await UniversimeApi.Group.update( {
                ...body,
                group: group.id!,
            } );

        await callback?.( res );
    }
}

type ManageGroupForm = UniversiForm.Data<{
    nickname: string;
    name: string;
    description: string;
    image?: File | string;
    bannerImage?: File | string;
    headerImage?: File | string;
    groupType: Group.Type;
    canCreateSubgroup: boolean;
    isPublic: boolean;
    canJoin: boolean;
}>;
