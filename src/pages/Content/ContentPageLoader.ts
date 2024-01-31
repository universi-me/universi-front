import { type LoaderFunctionArgs } from "react-router";

import UniversimeApi from "@/services/UniversimeApi";
import { removeFalsy } from "@/utils/arrayUtils";
import { type Content, type Folder } from "@/types/Capacity";

export type ContentPageLoaderSuccess = {
    content: Folder;
    materials: Content[];
}

export type ContentPageLoaderFail = {
    content: undefined;
    materials: undefined;

    reasons: string[];
}

export type ContentPageLoaderResponse = ContentPageLoaderSuccess | ContentPageLoaderFail;

export async function fetchContentPageData(contentId: string | undefined): Promise<ContentPageLoaderResponse> {
    if (contentId === undefined) return {
        content: undefined,
        materials: undefined,
        reasons: ["ID do conteúdo não especificado"],
    };

    const [fetchContent, fetchMaterials] = await Promise.all([
        UniversimeApi.Capacity.getFolder({ id: contentId }),
        UniversimeApi.Capacity.contentsInFolder({ id: contentId }),
    ]);

    const content = fetchContent.body?.folder;
    const materials = fetchMaterials.body?.contents;

    if (!content || !materials) return {
        content: undefined,
        materials: undefined,

        reasons: removeFalsy([
            fetchContent.message,
            fetchMaterials.message,
        ]),
    };

    return {
        content, materials,
    }
}

export function ContentPageLoader(args: LoaderFunctionArgs) {
    const content = args.params["id"];
    return fetchContentPageData(content);
}
