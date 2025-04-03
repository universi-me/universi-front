import { useContext, MouseEvent } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { UniversimeApi } from "@/services"
import { YouTubePlayerContext, type YouTubePlayerContextType } from "@/contexts/YouTube";
import { ContentContext, type ContentContextType } from "@/pages/Content";
import { MATERIAL_THUMB_FILE, MATERIAL_THUMB_LINK, MATERIAL_THUMB_VIDEO } from "@/utils/assets";
import { getYouTubeVideoIdFromUrl, isAbsoluteUrl } from "@/utils/regexUtils";
import { type OptionInMenu, hasAvailableOption, renderOption } from "@/utils/dropdownMenuUtils";
import { makeClassName } from "@/utils/tsxUtils";
import * as SwalUtils from "@/utils/sweetalertUtils";

import "./MaterialList.less";

export function MaterialList() {
    const contentContext = useContext(ContentContext);
    const youTubePlayerContext = useContext(YouTubePlayerContext);

    if (!contentContext) return null;

    return <div id="material-list">
        {
            contentContext.materials.length > 0
                ? contentContext.materials.map(m => <RenderMaterial key={m.id} material={m} contexts={{ contentContext, youTubePlayerContext }} beingWatched={contentContext.watchingProfile !== undefined} />)
                : <p className="empty-list">Nenhum material postado para esse conteúdo.</p>
        }
    </div>
}

type RenderMaterialProps = {
    material: Content;
    beingWatched: boolean;
    contexts: {
        contentContext: ContentContextType;
        youTubePlayerContext: YouTubePlayerContextType;
    };
};

function RenderMaterial(props: Readonly<RenderMaterialProps>) {
    const { material, contexts, beingWatched } = props;
    const { imageUrl, onInteract } = getMaterialVariantData(material);

    const materialUrl = isAbsoluteUrl(material.url)
        ? material.url
        : "http://" + material.url;

    const OPTIONS_DEFINITION: OptionInMenu<Content>[] = [
        {
            text: "Editar",
            biIcon: "pencil-fill",
            onSelect(material) {
                contexts.contentContext.setEditingSettings({ material });
            },
            hidden() {
                return !contexts.contentContext.content.canEdit;
            },
        },
        {
            text: "Excluir",
            biIcon: "trash-fill",
            className: "delete",
            onSelect(material) {
                SwalUtils.fireModal({
                    showCancelButton: true,
                    cancelButtonText: "Cancelar",
                    confirmButtonText: "Remover",
                    confirmButtonColor: "var(--font-color-alert)",
                    text: "Tem certeza que deseja remover este conteúdo deste grupo?",
                    icon: "warning",
                }).then(res => {
                    if (res.isConfirmed) {
                        UniversimeApi.Capacity.Folder.changeContents( contexts.contentContext.content.reference, {
                            removeContentsIds: [ material.id ],
                        } ).then(res => {
                            if (res.isSuccess()) contexts.contentContext.refreshMaterials();
                        });
                    }
                });
            },
            hidden() {
                return !contexts.contentContext.content.canEdit;
            },
        }
    ];

    return <div className="material-item">
        <button type="button" className={makeClassName("change-status", !beingWatched && "can-check")} onClick={handleCheckButton}>
            <i className={makeClassName("bi", material.status === "DONE" ? "bi-check-circle-fill" : "bi-check-circle")} />
        </button>

        <a href={materialUrl} target="_blank" onClick={onInteract}>
            <img src={imageUrl} className="material-item-thumb" alt="" />
        </a>
        <div className="material-item-data">
            <a className="material-item-title" href={materialUrl} target="_blank" onClick={onInteract}>
                { material.title }
            </a>

            <p className="material-item-description">
                { material.description }
            </p>
        </div>

        { !hasAvailableOption(OPTIONS_DEFINITION, material) ? <br /> :
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <button className="material-options-button">
                        <i className="bi bi-three-dots-vertical" />
                    </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Content className="material-options" side="left">
                    { OPTIONS_DEFINITION.map(def => renderOption(material, def)) }
                    <DropdownMenu.Arrow className="material-options-arrow" height=".5rem" width="1rem" />
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        }
    </div>

    function handleCheckButton() {
        if (beingWatched) return;

        const nextStatus: ContentStatusEnum = material.status === "DONE"
            ? "VIEW"
            : "DONE";

        UniversimeApi.Capacity.Content.setStatus( material.id, { contentStatusType: nextStatus })
            .then(res => {
                if (res.isSuccess())
                    contexts.contentContext.refreshMaterials();
            })
    }

    function getMaterialVariantData(material: Content) {
        let imageUrl = MATERIAL_THUMB_LINK;
        let onInteract = undefined;

        if (material.type === "VIDEO") {
            imageUrl = MATERIAL_THUMB_VIDEO;
            const isYouTubeVideo = !!getYouTubeVideoIdFromUrl(material.url);

            if (isYouTubeVideo) onInteract = ( e: MouseEvent ) => {
                e.preventDefault();
                contexts.youTubePlayerContext.playMaterial(material, () => {contexts.contentContext.refreshMaterials()});
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
}
