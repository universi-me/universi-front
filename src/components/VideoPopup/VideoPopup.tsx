import YouTube from "react-youtube";

import "./VideoPopup.css"

export function VideoPopup({id, handleClose} : {id: string, handleClose : (id : string, symbol : string) => void }){

    return(

        <div className="popup-container" id="popup-container">
            <div className="iframe-container" id="iframe-container">
                <div className="close" id="close" onClick={(event)=>{ handleClose(id, event.currentTarget.innerHTML)}}>
                    ✖
                </div>
                <YouTube
                videoId={`${id}`}
                id={`${id}`}
                opts={{height: "100%", width: "100%", "border-radius" : "10px"}}
                style={{aspectRatio: "16/9", height: "100%", width: "100%", borderRadius : "10px"}}
                />
            </div>
        </div>


    )

}