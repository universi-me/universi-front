import { type LoaderFunctionArgs } from "react-router";

import { UniversimeApi } from "@/services"
import { removeFalsy } from "@/utils/arrayUtils";
import { ProfileClass } from "@/types/Profile";

export type ContentPageLoaderSuccess = {
    content: Folder;
    materials: Content[];
    beingWatched?: ProfileClass;

    reasons?: undefined;
}

export type ContentPageLoaderFail = {
    content?: undefined;
    materials?: undefined;
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
        const [ fetchBeingWatchedData, fetchFolderData, fetchWatchData ] = await Promise.all([
            UniversimeApi.Profile.get( watchUsername ),
            UniversimeApi.Capacity.Folder.get( folderReference ),
            UniversimeApi.Capacity.Folder.watch( folderReference, watchUsername ),
        ]);

        if ( !fetchFolderData.isSuccess() ) return {
            reasons: fetchFolderData.error?.errors ?? [],
        }

        if ( !fetchBeingWatchedData.isSuccess() ) return {
            reasons: fetchBeingWatchedData.error?.errors ?? [],
        }

        if (fetchWatchData.isSuccess()) return {
            content: fetchFolderData.data,
            materials: fetchWatchData.data.map(c => ({...c.content, status: c.status})),
            beingWatched: new ProfileClass(fetchBeingWatchedData.data),
        };

        else return {
            reasons: fetchWatchData.error?.errors ?? [],
        };
    }

    const [fetchContent, fetchMaterials] = await Promise.all([
        UniversimeApi.Capacity.Folder.get( folderReference ),
        UniversimeApi.Capacity.Folder.contents( folderReference ),
    ]);

    const content = fetchContent.data;
    const materials = fetchMaterials.data;

    if (!content || !materials) return {
        content: undefined,
        materials: undefined,

        reasons: removeFalsy([
            fetchContent.errorMessage,
            fetchMaterials.errorMessage,
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
