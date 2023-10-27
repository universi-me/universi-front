import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UniversimeApi from "@/services/UniversimeApi";
import * as SwalUtils from "@/utils/sweetalertUtils";
import { EMPTY_LIST_CLASS, GroupContext } from "@/pages/Group";
import { setStateAsValue } from "@/utils/tsxUtils";
import { type Content } from "@/types/Capacity";
import YouTube from "react-youtube";

export function GroupContentMaterials() {
    const groupContext = useContext(GroupContext);
    const [materials, setMaterials] = useState<Content[]>();
    const [filterMaterials, setFilterMaterials] = useState<string>("");

    useEffect(() => {
        refreshMaterials();
    }, [groupContext?.currentContent?.id]);

    if (groupContext === null || materials === undefined || groupContext.currentContent === undefined) {
        return null;
    }

    const organizationName = groupContext.group.organization
        ? `${groupContext.group.organization.name} > `
        : "";

    return (
        <section id="materials" className="group-tab">
            <div className="heading">
                <i className="bi bi-list-ul tab-icon"/>
                <h2 className="title">Materiais em {organizationName}{groupContext.group.name} &gt; {groupContext.currentContent.name}</h2>
                <div className="go-right">
                    <div id="filter-wrapper">
                        <i className="bi bi-search filter-icon"/>
                        <input type="search" name="filter-materials" id="filter-materials" className="filter-input"
                            onChange={setStateAsValue(setFilterMaterials)} placeholder={`Buscar em ${groupContext.group.name}`}
                        />
                    </div>
                </div>
            </div>

            <div className="material-list"> { makeMaterialsList(materials, filterMaterials) } </div>
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

    function makeMaterialsList(materials: Content[], filter: string) {
        if (materials.length === 0) {
            return <p className={EMPTY_LIST_CLASS}>Esse conteúdo não possui materiais.</p>
        }

        const filteredMaterials = filter.length === 0
            ? materials
            : materials.filter(c => c.title.toLowerCase().includes(filter.toLowerCase()));

        if (filteredMaterials.length === 0) {
            return <p className={EMPTY_LIST_CLASS}>Nenhum material encontrado com a pesquisa.</p>
        }

        return filteredMaterials
            .map(renderMaterial);
    }

    function renderMaterial(material: Content) {
        const youTubeMatch = YOU_TUBE_MATCH.exec(material.url);

        return (
            <div className="material-item" key={material.id}>
                {
                    youTubeMatch !== null
                        ? renderYouTubeEmbed(youTubeMatch)
                    : material.type === "Documento"
                        ? "doc-icon"
                    : material.type === "Pasta"
                        ? "folder-icon"
                    : "no idea"
                }

                <div className="info">
                    <Link to={material.url} target="_blank" className="material-name">{material.title}</Link>
                    <p className="material-description">{material.description}</p>
                </div>
            </div>
        );
    }

    function renderYouTubeEmbed(videoUrl: RegExpExecArray) {
        const videoId = videoUrl[1] ?? videoUrl[2];

        return (
            <div id={`iframe${videoId}`} style={{transition: "0.2s"}}>
                <YouTube
                    // src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                    videoId={`${videoId}`}
                    title="YouTube video player"
                    opts={{height: "200rem", width: "auto"}}
                    style={{transition: "0.2s"}}
                    // allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    // allowFullScreen
                    {...{frameborder:"0"}}
                    id={`${videoId}`}
                    onPlay={()=>playVideo(videoId)}
                    onPause={() => pauseVideo(videoId)}
                />
            </div>
        );
    }


    function playVideo(id : string){
        let iframeContainer = document.getElementById("iframe"+id)
        console.log(iframeContainer)
        iframeContainer?.classList.add("iframe-container")

        let iframe = document.getElementById(id)
        iframe?.classList.add("fullscreen-video")
    }

    function pauseVideo(id: string){
        let iframeContainer = document.getElementById("iframe"+id)
        console.log(iframeContainer)
        iframeContainer?.classList.remove("iframe-container")

        let iframe = document.getElementById(id)
        iframe?.classList.remove("fullscreen-video")
    }

    function onload(id: string){
        document.getElementById(id)?.addEventListener("change", function(event){
            alert("Click!")
        })
        alert("loaded")
    }
}

const YOU_TUBE_MATCH = /^(?:https:\/\/)?(?:(?:www\.youtube\.com\/watch\?v=([-A-Za-z0-9_]{11,}))|(?:youtu\.be\/([-A-Za-z0-9_]{11,})))/;
