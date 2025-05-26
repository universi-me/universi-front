import { useEffect, useState } from "react";

import { UniversimeApi } from "@/services"
import UniversiForm from "@/components/UniversiForm2";
import LoadingSpinner from "@/components/LoadingSpinner";

import { type MaterialTypeArrayObject, MaterialTypeSelect } from "@/types/Capacity";
import "./ManageMaterial.less";
import { ApiResponse } from "@/utils/apiUtils";

export type ManageMaterialProps = {
    /** A null `material` means a material is being created, while a value means
     * an existing material is being edited.
     */
    material: Content | null;

    /** The content the material will be added to when being created */
    content?: Folder;

    /** Callback executed after the material is saved */
    callback?: ( res: Optional<ApiResponse<Capacity.Content.DTO>> ) => any;
}

export function ManageMaterial(props: Readonly<ManageMaterialProps>) {
    const { material, callback, content } = props;
    const [availableCategories, setAvailableCategories] = useState<Category[]>();

    useEffect(() => {
        updateCategories();
    }, [props]);

    if (availableCategories === undefined) return <LoadingSpinner />;

    const isNewMaterial = material === null;

    return <UniversiForm.Root title={ isNewMaterial ? "Criar material" : "Editar material" } callback={ handleForm }>
        <UniversiForm.Input.Text
            param="title"
            label="Nome do Material"
            defaultValue={ material?.title }
            required
        />

        <UniversiForm.Input.Text
            param="description"
            label="Descrição do Material"
            defaultValue={ material?.description ?? undefined }
            isLongText
            maxLength={ 200 }
        />

        <UniversiForm.Input.Text
            param="url"
            label="Link do Material"
            defaultValue={ material?.url }
            required
            type="url"
            maxLength={ 200 }
        />

        <MaterialTypeSelect
            param="type"
            label="Tipo do Material"
            defaultValue={ material?.type }
            required
        />

        <UniversiForm.Input.Select
            param="categories"
            label="Categorias do Material"
            isMultiSelection
            required
            options={ availableCategories }
            defaultValue={ material?.categories }
            getOptionUniqueValue={ c => c.id }
            getOptionLabel={ c => c.name }
            canCreateOptions
            onCreateOption={ async name => {
                await UniversimeApi.Capacity.Category.create({ name });
                return updateCategories();
            } }
        />
    </UniversiForm.Root>

    async function handleForm( form: ManageMaterialForm ) {
        if ( !form.confirmed )
            return callback?.( undefined );

        const body = {
            categoriesIds: form.body.categories.map( c => c.id ),
            description: form.body.description,
            rating: 1 as const,
            title: form.body.title,
            type: form.body.type.type,
            url: form.body.url,
        };

        const res = isNewMaterial
            ? await UniversimeApi.Capacity.Content.create( {
                ...body,
                folders: content && [ content.id ],
            } )
            : await UniversimeApi.Capacity.Content.update( material.id, body );

        return callback?.( res );
    }

    async function updateCategories() {
        const res = await UniversimeApi.Capacity.Category.list();
        if (res.isSuccess()) setAvailableCategories(res.data);

        return res.data ?? [];
    }
}

type ManageMaterialForm = UniversiForm.Data<{
    title: string;
    description: string;
    url: string;
    type: MaterialTypeArrayObject;
    categories: Capacity.Category.DTO[];
}>;
