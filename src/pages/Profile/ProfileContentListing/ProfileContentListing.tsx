import UniversimeApi from "@/services/UniversimeApi";
import { Content } from "@/types/Capacity";
import { useEffect, useState } from "react";
import { ProfileContentItem } from "../ProfileContentItem/ProfileContentItem";
import "./ProfileContentListing.css"

export function ProfileContentListing({amount = -1, filter = "Vídeo"} : {amount?: number, filter? : string}){

    const [availableContents, setAvailableContents] = useState<Content[]>([])
    const [title, setTitle] = useState(filter)

    useEffect( () =>{
        UniversimeApi.Capacity.contentList()
        .then(res => setAvailableContents(filterContents(res.body.contents)))
        setTitle(filter.replace("Vídeo", "Conteúdos").replace("Documento", "Arquivos"))
    }, [availableContents, [], filter])

    function filterContents(contents : Content[]){
        let contentsFiltered : Content[] = []
        contents.forEach((content) => {
          if(content.type == filter)
            contentsFiltered.push(content)
        })
        return contentsFiltered
    }

    useEffect(() => {
        const extractVideoId = (url: string) => {
          const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
          const match = url.match(regExp);
          if (match && match[1].length === 11) {
            return match[1];
          }
        };
    
        const updateThumbnailImage = (content : Content) => {
          const videoId = extractVideoId(content.url);
          if (videoId) {
            const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
            content.image = thumbnailUrl
          }
        };
    
        // const contentThumbnails = document.querySelectorAll('.content-thumbnail');
        // contentThumbnails.forEach(updateThumbnailImage);
        availableContents.forEach(updateThumbnailImage)

        if(amount != -1)
            setAvailableContents(availableContents.slice(1, amount))
        

      }, [availableContents]);

      return(
        <div>
            <h1 className="content-name">Meus {title}</h1>
            <div className="contents">
                {
                    availableContents.length === 0 ? <p>Nenhum conteúdo no momento</p> :  

                    availableContents.map((content) =>(
                        <div>
                          <ProfileContentItem content_={content}></ProfileContentItem>
                        </div>
                    ))
                }
            </div>
        </div>
      )



}