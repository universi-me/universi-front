import { Folder } from "@/types/Capacity";
import { useEffect, useState, useContext } from "react";
import { ProfileContentItem } from "../ProfileContentItem/ProfileContentItem";
import "./ProfileContentListing.css"
import { ProfileContext } from "../ProfileContext";

export function ProfileContentListing({title = "Vídeo"} : {title : string}){

    const profileContext = useContext(ProfileContext);
    const [availableContents, setAvailableContents] = useState<Folder[]>([])

    useEffect( () =>{
        setAvailableContents(profileContext?.profileListData.folders ?? []);
    }, [title])

      return(
        <div>
            <h1 className="content-name">Meus {title}</h1>
            <div className="contents">
                {
                    availableContents.length === 0 ? <p>Nenhum conteúdo no momento</p> :  

                    availableContents.map((content) =>(
                          <ProfileContentItem content={content} key={content.id} />
                    ))
                }
            </div>
        </div>
      )



}