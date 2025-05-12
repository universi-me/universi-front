import { useEffect, useState } from "react";

import { UniversimeApi } from "@/services"
import UniversiForm from "@/components/UniversiForm2";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ApiResponse, contentImageUrl } from "@/utils/apiUtils";

import "./ManageContent.less";

export type ManageContentProps = {
    /** A null `content` means a content is being created, while a value means
     * an existing content is being edited.
     */
    content: Folder | null;

    /** The default group the content should be added to */
    group?: Group;

    /** A callback to be called after the content is saved */
    afterSave?: ( res: Optional<ApiResponse<Capacity.Folder.DTO>> ) => any;
};

export function ManageContent(props: Readonly<ManageContentProps>) {
    const [content, setContent] = useState(props.content);
    const [group, setGroup] = useState(props.group);

    const [availableCategories, setAvailableCategories] = useState<Category[]>();
    const [availableCompetenceTypes, setAvailableCompetenceTypes] = useState<CompetenceType[]>();

    useEffect(() => {
        setContent(props.content);
        setGroup(props.group);

        updateCategories();
        updateCompetenceTypes();
    }, [props]);

    if (availableCategories === undefined || availableCompetenceTypes === undefined)
        return <LoadingSpinner />;

    const isNewContent = content === null;

    return <UniversiForm.Root title={ isNewContent ? "Criar Conteúdo" : "Editar Conteúdo" } callback={ handleForm }>
        <UniversiForm.Input.Text
            param="name"
            label="Nome do Conteúdo"
            defaultValue={ content?.name }
            required
            maxLength={ 100 }
        />

        <UniversiForm.Input.Text
            param="description"
            label="Descrição do Conteúdo"
            isLongText
            defaultValue={ content?.description ?? undefined }
            maxLength={ 200 }
        />

        <UniversiForm.Input.Image
            param="image"
            label="Imagem do Conteúdo"
            defaultValue={ content ? contentImageUrl( content ) : undefined }
            aspectRatio={ 1 }
        />

        <UniversiForm.Input.Select
            param="categories"
            label="Categorias do Conteúdo"
            getOptionLabel={ c => c.name }
            getOptionUniqueValue={ c => c.id }
            isMultiSelection
            defaultValue={ content?.categories }
            options={ availableCategories }
            canCreateOptions
            onCreateOption={ async name => {
                await UniversimeApi.Capacity.Category.create( { name } );
                const res = await updateCategories()
                return res.body ?? [];
            } }
        />

        <UniversiForm.Input.Select
            param="badges"
            label="Selos de Competência"
            getOptionLabel={ c => c.name }
            getOptionUniqueValue={ c => c.id }
            isMultiSelection
            defaultValue={ content?.grantsBadgeToCompetences }
            options={ availableCompetenceTypes }
            canCreateOptions
            onCreateOption={ async name => {
                await UniversimeApi.CompetenceType.create( { name } );
                const res = await updateCompetenceTypes()
                return res.body ?? [];
            } }
        />
    </UniversiForm.Root>

    async function handleForm( form: ManageContentForm ) {
        if ( !form.confirmed )
            return props.afterSave?.( undefined );

        const imageUploadResponse = form.body.image instanceof File
            ? await UniversimeApi.Image.upload( { image: form.body.image, isPublic: true } )
            : undefined;

        const body = {
            name: form.body.name,
            rating: 1 as const,
            categoriesIds: form.body.categories.map( c => c.id ),
            competenceTypeBadgeIds: form.body.badges.map( b => b.id ),
            description: form.body.description,
            image: imageUploadResponse?.body,
            publicFolder: true, // todo - switch field
            grantedAccessGroupsIds: isNewContent && group?.id
                ? [ group.id ]
                : undefined,
        };

        const res = isNewContent
            ? await UniversimeApi.Capacity.Folder.create( body )
            : await UniversimeApi.Capacity.Folder.update( content.id, body );

        return props.afterSave?.( res );
    }

    async function updateCategories() {
        const res = await UniversimeApi.Capacity.Category.list();
        if (res.isSuccess()) setAvailableCategories(res.data);

        return res;
    }

    async function updateCompetenceTypes() {
        const res = await UniversimeApi.CompetenceType.list();
        if (res.isSuccess())
            setAvailableCompetenceTypes(res.data);

        return res;
    }
}

type ManageContentForm = UniversiForm.Data<{
    name: string;
    description?: string;
    image?: File | string;
    categories: Capacity.Category.DTO[];
    badges: Competence.Type[];
}>;
