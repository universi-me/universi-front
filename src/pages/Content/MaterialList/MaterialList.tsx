import { useContext, MouseEvent } from "react";

import { YouTubePlayerContext, type YouTubePlayerContextType } from "@/contexts/YouTube";
import { ContentContext, type ContentContextType } from "@/pages/Content";
import { MATERIAL_THUMB_FILE, MATERIAL_THUMB_LINK, MATERIAL_THUMB_VIDEO } from "@/utils/assets";
import { getYouTubeVideoIdFromUrl } from "@/utils/regexUtils";

import { type Content } from "@/types/Capacity";

import "./MaterialList.less";

export function MaterialList() {
    const contentContext = useContext(ContentContext);
    const youTubePlayerContext = useContext(YouTubePlayerContext);

    if (!contentContext) return null;

    return <div id="material-list">
        {
            contentContext.materials.length > 0
                ? contentContext.materials.map(m => <RenderMaterial key={m.id} material={m} contexts={{ contentContext, youTubePlayerContext }} />)
                : <p className="empty-list">Nenhum material postado para esse conteúdo.</p>
        }
    </div>
}

type RenderMaterialProps = {
    material: Content;
    contexts: {
        contentContext: ContentContextType;
        youTubePlayerContext: YouTubePlayerContextType;
    };
};

function RenderMaterial({ material, contexts }: Readonly<RenderMaterialProps>) {
    const { imageUrl, onInteract } = getMaterialVariantData(material, contexts.youTubePlayerContext);

    return <div className="material-item">
        <a href={material.url} target="_blank" onClick={onInteract}>
            <img src={imageUrl} className="material-item-thumb" alt="" />
        </a>
        <div className="material-item-data">
            <a className="material-item-title" href={material.url} target="_blank" onClick={onInteract}>
                { material.title }
            </a>

            <p className="material-item-description">
                { material.description }
            </p>
        </div>
    </div>
}

function getMaterialVariantData(material: Content, youTubePlayerContext: YouTubePlayerContextType) {
    let imageUrl = MATERIAL_THUMB_LINK;
    let onInteract = undefined;

    if (material.type === "VIDEO") {
        imageUrl = MATERIAL_THUMB_VIDEO;
        const isYouTubeVideo = !!getYouTubeVideoIdFromUrl(material.url);

        if (isYouTubeVideo) onInteract = ( e: MouseEvent ) => {
            e.preventDefault();
            youTubePlayerContext.playMaterial(material);
        }
    }

    else if (material.type === "FILE") {
        imageUrl = MATERIAL_THUMB_FILE;
    }

    else if (material.type === "FOLDER") {
        imageUrl = MATERIAL_THUMB_FILE;
    }

    return { imageUrl, onInteract, }
}
