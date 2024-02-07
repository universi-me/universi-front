import { type LoaderFunctionArgs } from "react-router";

import UniversimeApi from "@/services/UniversimeApi";
import { removeFalsy } from "@/utils/arrayUtils";
import { type Content, type Folder } from "@/types/Capacity";
import { ProfileClass } from "@/types/Profile";

export type ContentPageLoaderSuccess = {
    content: Folder;
    materials: Content[];
    beingWatched?: ProfileClass;
}

export type ContentPageLoaderFail = {
    content: undefined;
    materials: undefined;
    beingWatched?: undefined;

    reasons: string[];
}

export type ContentPageLoaderResponse = ContentPageLoaderSuccess | ContentPageLoaderFail;

export async function fetchContentPageData(folderReference: string | undefined, watchUsername?: string | null): Promise<ContentPageLoaderResponse> {
    if (folderReference === undefined) return {
        content: undefined,
        materials: undefined,
        reasons: ["ID do conteúdo não especificado"],
    };

    if (watchUsername) {
        const fetchWatchData = await UniversimeApi.Capacity.watchProfileProgress({ folderReference, username: watchUsername, });
        if (fetchWatchData.success) return {
            content: fetchWatchData.body.folder,
            materials: fetchWatchData.body.contentWatches.map(c => ({...c.content, status: c.status})),
            beingWatched: new ProfileClass(fetchWatchData.body.watching),
        };

        else return {
            content: undefined,
            materials: undefined,
            reasons: removeFalsy([fetchWatchData.message]),
        };
    }

    const [fetchContent, fetchMaterials] = await Promise.all([
        UniversimeApi.Capacity.getFolder({ reference: folderReference }),
        UniversimeApi.Capacity.contentsInFolder({ reference: folderReference }),
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

    const url = new URL(args.request.url);
    const watchUsername = url.searchParams.get("watch");

    return fetchContentPageData(content, watchUsername);
}
