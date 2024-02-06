import { PropsWithChildren, useMemo, useState } from "react";
import { YouTubePlayerContext } from "@/contexts/YouTube";

import { ContentStatusEnum, type Content } from "@/types/Capacity";
import { getYouTubeVideoIdFromUrl } from "@/utils/regexUtils";
import { VideoPopup } from "@/components/VideoPopup/VideoPopup";
import UniversimeApi from "@/services/UniversimeApi";

type YouTubePlayerProviderProps = Readonly<PropsWithChildren<{}>>;

export function YouTubePlayerProvider({children}: YouTubePlayerProviderProps) {
    const [currentMaterial, setCurrentMaterial] = useState<Content>();
    const [playingInMiniature, setPlayingInMiniature] = useState<boolean>(false);

    const currentVideoId = useMemo(() => {
        if (!currentMaterial) return undefined;
        else return getYouTubeVideoIdFromUrl(currentMaterial.url);
    }, [currentMaterial?.url]);

    const context = useMemo(() => ({
        currentVideoId,
        currentMaterial,
        playingInMiniature,
        playMaterial,
    }), [currentMaterial]);

    return (
        <YouTubePlayerContext.Provider value={context}>
            { children }
            {
                currentVideoId && currentMaterial &&
                <VideoPopup material={currentMaterial} handleClose={handleVideoClose} handleWatched={(event) => handleWatchedButton(currentMaterial, event)} handleMinimized={handleVideoClick}/>
            }
        </YouTubePlayerContext.Provider>
    );

    async function playMaterial(material: {id: string}) {
        const fetchApiMaterial = await UniversimeApi.Capacity.getContent({ id: material.id });
        const apiMaterial = fetchApiMaterial.success ? fetchApiMaterial.body.content : undefined;

        if (!apiMaterial) return false;

        const videoId = getYouTubeVideoIdFromUrl(apiMaterial.url);
        if (!videoId) {
            console.error(`URL '${apiMaterial.url}' is not a YouTube video URL`)
            return false;
        }

        handleVideoClick(apiMaterial);
        return true;
    }

    function getVideoContainers() : {[key : string] : HTMLElement | null} {
        let elements : {[key : string] : HTMLElement | null} = {};

        let popupContainer = document.getElementById("popup-container")
        let close = document.getElementById("close")
        let iframeContainer = document.getElementById("iframe-container");
        let videoContainer = document.getElementById("video-container");

        elements.popupContainer = popupContainer;
        elements.close = close;
        elements.iframeContainer = iframeContainer;
        elements.videoContainer = videoContainer;

        return elements
    }

    function handleVideoClose(id : string, symbol : string){
        if(symbol == "✖"){
            setCurrentMaterial(undefined);
            setPlayingInMiniature(false);
            return;
        }

        expand(id);
    }

    function expand(id : string){
        let containers = getVideoContainers()

        containers.popupContainer?.classList.remove("mini-player")
        containers.popupContainer?.classList.add("popup-container")
        containers.iframeContainer?.classList.remove("mini-iframe")
        containers.iframeContainer?.classList.add("iframe-container")
        containers.videoContainer?.classList.add("fullscreen")

        if(containers.close){
            containers.close.innerHTML = "✖";
            containers.close.onclick = () => { handleVideoClose}
        }
        setPlayingInMiniature(false);
    }

    async function handleWatchedButton(material : Content, event : any){
        event.stopPropagation();

        let nextStatus : ContentStatusEnum = material.status == "DONE" ? "NOT_VIEWED" : "DONE"

        await UniversimeApi.Capacity.createContentStatus({contentId : material.id});
        await UniversimeApi.Capacity.editContentStatus({contentId: material.id, contentStatusType : nextStatus}).then(
            (data) => {
                if (!data.success) return;

                const status = data.body.contentStatus.status;
                if(status == "DONE" || status == "NOT_VIEWED")
                    setCurrentMaterial({...material, status});
            }
        )
    }

    function handleVideoClick(material : Content){
        const id = getYouTubeVideoIdFromUrl(material.url);
        if (!id) return;

        if(currentVideoId == id){
            if(document.getElementsByClassName("fullscreen"))
                showMiniature(id)
            else
                expand(id)
        }
        else{
            setPlayingInMiniature(false)
            setCurrentMaterial(material);
        }
    }

    function showMiniature(id : string){
        let containers = getVideoContainers()

        containers.popupContainer?.classList.remove("popup-container")
        containers.popupContainer?.classList.add("mini-player")
        containers.iframeContainer?.classList.remove("iframe-container")
        containers.iframeContainer?.classList.add("mini-iframe")
        containers.videoContainer?.classList.remove("fullscreen")


        if(containers.close){
            containers.close.innerHTML = "&#x26F6;"
            containers.close.onclick = () => { handleVideoClose}
        }
        setPlayingInMiniature(true)
    }
}
