import YouTube from "react-youtube";
import { useEffect, useState } from "react"

import "./VideoPopup.css"
import { Content } from "@/types/Capacity";
import { getYouTubeVideoIdFromUrl } from "@/utils/regexUtils";

export function VideoPopup({material, handleClose, handleWatched, handleMinimized} : {material : Content, handleClose : (id : string, symbol : string) => void, handleWatched : (event : any) => void, handleMinimized : (material: Content) => void}){

    const [status, setStatus] = useState(material.status)
    const id = getYouTubeVideoIdFromUrl(material.url);

    if (!id)
        return null;

    return(
        <div className="video-container fullscreen" id="video-container">
            <div className="popup-container" id="popup-container">
                <div className="iframe-container" id="iframe-container">
                    <div className="window-button-container">
                        <div className="close" id="close" onClick={(event)=>{ handleClose(id, event.currentTarget.innerHTML)}}>
                            ✖
                        </div>
                        <div className="close" id="minimize" onClick={() => handleMinimized(material)}>
                            <i className="bi bi-dash"></i>
                        </div>
                    </div>
                    <YouTube
                    videoId={`${id}`}
                    id={`${id}`}
                    opts={{height: "100%", width: "100%"}}
                    style={{aspectRatio: "16/9", height: "90%", width: "100%"}}
                    />
                    {
                        status != "DONE"
                        ?
                            <div className="watched-button" onClick={(event) => {handleWatched(event); setStatus("DONE");}}><i className="bi bi-check2-circle status-icon"></i> Marcar como concluído</div>
                        :
                            <div className="watched-button watched" onClick={(event) => {handleWatched(event); setStatus("NOT_VIEWED");}}><i className="bi bi-check2-circle status-icon"></i> Concluído</div>
                    }
                </div>
            </div>
        </div>


    )

}