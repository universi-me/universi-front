import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UniversimeApi from "@/services/UniversimeApi";
import * as SwalUtils from "@/utils/sweetalertUtils";
import { EMPTY_LIST_CLASS, GroupContext } from "@/pages/Group";
import { setStateAsValue } from "@/utils/tsxUtils";
import { type Content } from "@/types/Capacity";
import YouTube from "react-youtube";

import "./GroupContentMaterials.less";
import { VideoPopup } from "@/components/VideoPopup/VideoPopup";

export function GroupContentMaterials() {
    const groupContext = useContext(GroupContext);
    const [materials, setMaterials] = useState<Content[]>();
    const [filterMaterials, setFilterMaterials] = useState<string>("");
    const [playingVideo, setPlayingVideo] = useState("")
    const [isMiniature, setIsMiniature] = useState(false)


    useEffect(() => {
        refreshMaterials();
    }, [groupContext?.currentContent?.id]);

    if (groupContext === null || materials === undefined || groupContext.currentContent === undefined) {
        return null;
    }

    const organizationName = groupContext.group.organization
        ? <Link to={`/group/${groupContext.group.organization.path}`} className="title-hyperlink">{groupContext.group.organization.name} &gt; </Link>
        : null;

    const groupName = <div onClick={() => groupContext.setCurrentContent(undefined)} style={{cursor: "pointer", display: "inline"}}>{groupContext.group.name}</div>

    return (
        <section id="materials" className="group-tab">
            <div className="heading">
                <i className="bi bi-list-ul tab-icon"/>
                <h2 className="title">{organizationName}{groupName} &gt; {groupContext.currentContent.name}</h2>
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
                        :
                        <Link to={material.url} target="_blank" className="material-name icon-container">
                            {
                                material.type === "Documento"
                                    ?
                                        <img src={`/assets/imgs/file.png`} className="material-image"></img>
                                : material.type === "Pasta"
                                    ?
                                        <img src={`/assets/imgs/file.png`} className="material-image"></img>
                                :
                                        <img src={`/assets/imgs/link.png`} className="material-image"></img>
                            }
                        </Link>
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
            <div className="icon-container" id={`icon-container-${videoId}`} onClick={() => { console.log("videoId: " + videoId+"\n playing: " + playingVideo + "\nMiniature: "+isMiniature);if(!isMiniature || videoId != playingVideo) handleVideoClick(videoId)}}>
                <img src="/assets/imgs/video.png" className="material-image"></img>
                {
                    playingVideo == videoId
                    ? <VideoPopup id={videoId} handleClose={handleVideoClose}/>
                    : <></>
                }
            </div>
        )
    }

    function handleVideoClick(id : string){
        if(playingVideo == id){
            showMiniature(id)
        }
        else{
            setIsMiniature(false)
            setPlayingVideo(id)
        }
    }

    function getVideoContainers() : {[key : string] : HTMLElement | null} {

        let elements : {[key : string] : HTMLElement | null} = {};

        let popupContainer = document.getElementById("popup-container")
        let close = document.getElementById("close")
        let iframeContainer = document.getElementById("iframe-container");

        elements.popupContainer = popupContainer;
        elements.close = close;
        elements.iframeContainer = iframeContainer;

        return elements
    }


    function expand(id : string){

        let containers = getVideoContainers()
        console.log(containers)

        containers.popupContainer?.classList.remove("mini-player")
        containers.popupContainer?.classList.add("popup-container")
        containers.iframeContainer?.classList.remove("mini-iframe")
        containers.iframeContainer?.classList.add("iframe-container")
        if(containers.close){
            containers.close.innerHTML = "✖";
            containers.close.onclick = () => { handleVideoClose}
        }
        setIsMiniature(false)


    }

    function showMiniature(id : string){

        let containers = getVideoContainers()

        containers.popupContainer?.classList.remove("popup-container")
        containers.popupContainer?.classList.add("mini-player")
        containers.iframeContainer?.classList.remove("iframe-container")
        containers.iframeContainer?.classList.add("mini-iframe")
        if(containers.close){
            containers.close.innerHTML = "&#x26F6;"
            containers.close.onclick = () => { handleVideoClose}
        }
        setIsMiniature(true)

    }

    function handleVideoClose(id : string, symbol : string){

        if(symbol == "✖"){
            setPlayingVideo("")
            setIsMiniature(false)
            return
        }
        expand(id)


    }

}



const YOU_TUBE_MATCH = /^(?:https:\/\/)?(?:(?:www\.youtube\.com\/watch\?v=([-A-Za-z0-9_]{11,}))|(?:youtu\.be\/([-A-Za-z0-9_]{11,})))/;
