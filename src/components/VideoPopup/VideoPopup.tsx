import YouTube from "react-youtube";
import { useEffect, useState } from "react"

import "./VideoPopup.css"
import { Content } from "@/types/Capacity";

export function VideoPopup({material, id, handleClose, handleWatched, handleMinimized} : {material : Content, id: string, handleClose : (id : string, symbol : string) => void, handleWatched : (event : any) => void, handleMinimized : (id: string, material: Content) => void}){

    const [status, setStatus] = useState(material.contentStatus.status)


    return(
        <div className="video-container fullscreen" id="video-container">
            <div className="popup-container" id="popup-container">
                <div className="iframe-container" id="iframe-container">
                    <div className="window-button-container">
                        <div className="close" id="close" onClick={(event)=>{ handleClose(id, event.currentTarget.innerHTML)}}>
                            ✖
                        </div>
                        <div className="close" id="minimize" onClick={() => handleMinimized(id, material)}>
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
                        material.contentStatus.status != "DONE"
                        ?
                            <div className="watched-button" onClick={(event) => {handleWatched(event); material.contentStatus.status = "DONE";}}><i className="bi bi-check2-circle status-icon"></i> Marcar como concluído</div>
                        :
                            <div className="watched-button watched" onClick={(event) => {handleWatched(event); material.contentStatus.status = "NOT_VIEWED";}}><i className="bi bi-check2-circle status-icon"></i> Concluído</div>
                    }
                </div>
            </div>
        </div>


    )

}