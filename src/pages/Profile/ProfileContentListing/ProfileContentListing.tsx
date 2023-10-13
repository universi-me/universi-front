import { Content, Folder } from "@/types/Capacity";
import { useEffect, useState, useContext } from "react";
import { ProfileContentItem } from "../ProfileContentItem/ProfileContentItem";
import "./ProfileContentListing.css"
import { ProfileContext } from "../ProfileContext";

export function ProfileContentListing({amount = -1, filter = "Vídeo"} : {amount?: number, filter? : string}){

    const profileContext = useContext(ProfileContext);
    const [availableContents, setAvailableContents] = useState<Folder[]>([])
    const [title, setTitle] = useState(filter)

    useEffect( () =>{
        setAvailableContents(filterContents(profileContext?.profileListData.folders ?? []))
        setTitle(filter.replace("Vídeo", "Conteúdos").replace("Documento", "Arquivos"))
    }, [amount, filter])

    function filterContents(contents : Folder[]){
        return contents;

        // let contentsFiltered : Content[] = []
        // contents.forEach((content) => {
        //   if(content.type == filter)
        //     contentsFiltered.push(content)
        // })
        // return contentsFiltered
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
        // availableContents.forEach(updateThumbnailImage)

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
                          <ProfileContentItem content={content} key={content.id} />
                    ))
                }
            </div>
        </div>
      )



}