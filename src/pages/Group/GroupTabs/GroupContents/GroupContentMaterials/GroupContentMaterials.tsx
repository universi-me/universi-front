import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import UniversimeApi from "@/services/UniversimeApi";
import * as SwalUtils from "@/utils/sweetalertUtils";
import { EMPTY_LIST_CLASS, GroupContext } from "@/pages/Group";
import { ManageMaterial } from "@/components/ManageMaterial";
import { ContentStatusEnum, type Content } from "@/types/Capacity";

import "./GroupContentMaterials.less";
import { renderOption, type OptionInMenu, hasAvailableOption } from "@/utils/dropdownMenuUtils";
import { ActionButton } from "@/components/ActionButton/ActionButton";
import { Filter } from "@/components/Filter/Filter";
import { YouTubePlayerContext } from "@/contexts/YouTube";
import { makeClassName } from "@/utils/tsxUtils";
import { getYouTubeVideoIdFromUrl, isAbsoluteUrl } from "@/utils/regexUtils";
import { MATERIAL_THUMB_FILE, MATERIAL_THUMB_LINK, MATERIAL_THUMB_VIDEO } from "@/utils/assets";

export function GroupContentMaterials() {
    const groupContext = useContext(GroupContext);
    const youTubeContext = useContext(YouTubePlayerContext);

    const playingVideo = youTubeContext.currentVideoId;
    const isMiniature = youTubeContext.playingInMiniature;

    const [materials, setMaterials] = useState<Content[]>();
    const [filterMaterials, setFilterMaterials] = useState<string>("");


    useEffect(() => {
        refreshMaterials();
    }, [groupContext?.currentContent?.id]);

    if (groupContext === null || materials === undefined || groupContext.currentContent === undefined) {
        return null;
    }

    const OPTIONS_DEFINITION: OptionInMenu<Content>[] = [
        {
            text: "Editar",
            biIcon: "pencil-fill",
            onSelect(data) {
                groupContext.setEditMaterial(data);
            },
            hidden() {
                return !groupContext?.group.canEdit;
            },
        },
        {
            text: "Excluir",
            biIcon: "trash-fill",
            className: "delete",
            onSelect: handleDeleteMaterial,
            hidden() {
                return !groupContext?.group.canEdit;
            },
        }
    ];

    return (
        <section id="materials" className="group-tab">
            <div className="heading top-container">
                <div className="content-title">{groupContext.currentContent.name}</div>
                <div className="go-right">
                    <Filter setter={setFilterMaterials} placeholderMessage={`Buscar em ${groupContext.group.name}`}/>
                        {  
                            groupContext.group.canEdit &&
                            <ActionButton name="Criar material" buttonProps={{onClick(){groupContext.setEditMaterial(null)}}}/>
                        }
                </div>
            </div>

            <MaterialsList materials={materials} filter={filterMaterials} />
            { groupContext.editMaterial !== undefined &&
                <ManageMaterial material={groupContext.editMaterial} content={groupContext.currentContent} afterSave={()=>{ refreshMaterials(); groupContext.setEditMaterial(undefined) }} />
            }
        </section>
    );

    function refreshMaterials() {
        const contentId = groupContext?.currentContent?.id;
        if (!contentId) {
            return;
        }

        UniversimeApi.Capacity.contentsInFolder({id: contentId})
            .then(response => {
                if (!response.success || !response.body) {
                    SwalUtils.fireModal({
                        titleText: "Erro ao acessar conteúdo",
                        text: response.message,
                        confirmButtonText: "Voltar aos conteúdos",
                    })
                        .then(result => {
                            if (result.isConfirmed)
                                groupContext.setCurrentContent(undefined);
                        })

                    return;
                }

                setMaterials(response.body.contents);
            });
    }

    type MaterialsListProps = { materials: Content[]; filter: string };
    function MaterialsList(props: Readonly<MaterialsListProps>) {
        const {materials, filter} = props;

        if (materials.length === 0) {
            return <p className={EMPTY_LIST_CLASS}>Esse conteúdo não possui materiais.</p>
        }

        const filteredMaterials = filter.length === 0
            ? materials
            : materials.filter(c => c.title.toLowerCase().includes(filter.toLowerCase()));

        if (filteredMaterials.length === 0) {
            return <p className={EMPTY_LIST_CLASS}>Nenhum material encontrado com a pesquisa.</p>
        }

        return <div className="material-list tab-list">
            { filteredMaterials.map(m => <RenderMaterial material={m} />) }
        </div>
    }

    type RenderMaterialProps = { material: Content };
    function RenderMaterial(props: Readonly<RenderMaterialProps>) {
        const { material } = props;
        const youTubeVideoId = getYouTubeVideoIdFromUrl(material.url);
        const materialUrl = youTubeVideoId
            ? material.url
            : isAbsoluteUrl(material.url)
                ? material.url
                : "http://" + material.url;

        return (
            <div className="material-item tab-item" key={material.id}>
                <button type="button" className="change-status" onClick={()=>{handleCheckButton(material)}}>
                    <i className={makeClassName("bi", material.status === "DONE" ? "bi-check-circle-fill" : "bi-check-circle")} />
                </button>
                {
                    youTubeVideoId !== undefined
                        ? renderYouTubeEmbed(youTubeVideoId, material)
                        :
                        <Link to={materialUrl} target="_blank" className="material-name icon-container">
                            {
                                material.type === "FILE"
                                    ?
                                        <img src={MATERIAL_THUMB_FILE} className="material-image"></img>
                                : material.type === "FOLDER"
                                    ?
                                        <img src={MATERIAL_THUMB_FILE} className="material-image"></img>
                                :
                                        <img src={MATERIAL_THUMB_LINK} className="material-image"></img>
                            }
                        </Link>
                }
                <div className="info">
                {
                    youTubeVideoId
                    ?
                        <div className="material-name" onClick={() => { const videoId = youTubeVideoId; if(!isMiniature || videoId!= playingVideo) youTubeContext.playMaterial(material, refreshMaterials)}}>
                            {material.title}
                        </div>
                    :
                        <Link to={materialUrl} target="_blank" className="material-name">
                            {material.title}
                        </Link>
                }
                    <p className="material-description">{material.description}</p>
                </div>

            { !hasAvailableOption(OPTIONS_DEFINITION, material) ? null :
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
        );
    }

    function renderYouTubeEmbed(videoId: string, material : Content) {
        return (
            <div className="icon-container" id={`icon-container-${videoId}`} onClick={() => {if(!isMiniature || videoId != playingVideo) youTubeContext?.playMaterial(material, refreshMaterials)}}>
                <img src={MATERIAL_THUMB_VIDEO} className="material-image"></img>
            </div>
        )
    }

    function handleDeleteMaterial(material: Content) {
        SwalUtils.fireModal({
            showCancelButton: true,

            cancelButtonText: "Cancelar",
            confirmButtonText: "Remover",
            confirmButtonColor: "var(--alert-color)",

            text: "Tem certeza que deseja remover este conteúdo deste grupo?",
            icon: "warning",
        }).then(res => {
            if (res.isConfirmed) {
                const currentContentId = groupContext?.currentContent?.id!;

                UniversimeApi.Capacity.removeContentFromFolder({ folderId: currentContentId, contentIds: material.id })
                    .then(res => {
                        if (!res.success)
                            return;

                        refreshMaterials();
                    });
            }
        });
    }

    function handleCheckButton(material: Content) {
        const nextStatus: ContentStatusEnum = material.status === "DONE"
            ? "VIEW"
            : "DONE";

        UniversimeApi.Capacity.editContentStatus({ contentId: material.id, contentStatusType: nextStatus }).then(res => {
            if (res.success) refreshMaterials();
        });
    }
}
