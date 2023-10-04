import { Content } from "@/types/Capacity";
import { useEffect, useState } from "react";
import './ProfileContentItem.css'
import { Link } from "react-router-dom";

export function ProfileContentItem({content_} : {content_ : Content}){

    const [content, setContent] = useState<Content | undefined>(content_)
    useEffect(() =>{
        setContent(content_)
    }, [content_])

    useEffect(() =>{
        setContent(content_)
    }, [content_])


    return(

        <div className="profile-content">
            {content !== undefined ?
            <>
            {
            content.type == "Vídeo" ?
            <Link to={`/capacitacao/play/${content.id}`}>
                <img src={content.image != null ? content.image : content.url} className="profile-content-thumbnail"/>
            </Link>
            :
            <Link to={content.url}>
                <img src={content.image != null ? content.image : content.url} className="profile-content-thumbnail"/>
            </Link>
            }
            <p className="profile-content-title">{content.title}</p>
            </>
            :
            <div> loading </div>
            }
        </div>
    )

}