import { Content } from "@/types/Capacity";
import { useEffect, useState } from "react";
import './ProfileContent.css'

export function ProfileContent({content_} : {content_ : Content}){

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
            <img src={content.image != null ? content.image : "a"} className="profile-content-thumbnail"/>
            <p className="profile-content-title">{content.title}</p>
            </>
            :
            <div> loading </div>
            }
        </div>
    )

}